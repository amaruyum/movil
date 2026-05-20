/**
 * app/movie/nueva.tsx
 * Modal para crear una nueva película.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, GENEROS } from '../../constants/Colors';
import { usePeliculas } from '../../hooks/usePeliculas';
import CampoFormulario from '../../components/CampoFormulario';
import { PeliculaInput } from '../../database/database';

const VALORES_INICIALES: PeliculaInput = {
  titulo: '',
  director: '',
  anio: new Date().getFullYear(),
  genero: 'Drama',
  puntuacion: 7,
  sinopsis: '',
  vista: 0,
};

interface ErroresFormulario {
  titulo?: string;
  director?: string;
  anio?: string;
}

/**
 * PantallaNuevaPelicula
 * Formulario para crear una nueva película con validación.
 */
export default function PantallaNuevaPelicula() {
  const router = useRouter();
  const { agregarPelicula, cargando } = usePeliculas();
  const [formulario, setFormulario] = useState<PeliculaInput>(VALORES_INICIALES);
  const [errores, setErrores] = useState<ErroresFormulario>({});

  const actualizarCampo = <K extends keyof PeliculaInput>(
    campo: K,
    valor: PeliculaInput[K]
  ): void => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    if (campo in errores) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  const validar = (): boolean => {
    const nuevosErrores: ErroresFormulario = {};
    if (!formulario.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio.';
    }
    if (!formulario.director.trim()) {
      nuevosErrores.director = 'El director es obligatorio.';
    }
    if (!formulario.anio || formulario.anio < 1888 || formulario.anio > new Date().getFullYear() + 2) {
      nuevosErrores.anio = 'Introduce un año válido (desde 1888).';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = async (): Promise<void> => {
  if (!validar()) return;
  try {
    await agregarPelicula(formulario);
    Alert.alert(
      '¡Película añadida!',
      `"${formulario.titulo}" se ha guardado en tu lista.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  } catch {
    Alert.alert('Error', 'No se pudo guardar la película.');
  }
};

  const cambiarPuntuacion = (delta: number): void => {
    const nueva = Math.min(10, Math.max(1, formulario.puntuacion + delta));
    actualizarCampo('puntuacion', nueva);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={estilos.contenedor}
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CampoFormulario
          etiqueta="Título *"
          placeholder="Ej. Inception"
          value={formulario.titulo}
          onChangeText={(val) => actualizarCampo('titulo', val)}
          errorMensaje={errores.titulo}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <CampoFormulario
          etiqueta="Director *"
          placeholder="Ej. Christopher Nolan"
          value={formulario.director}
          onChangeText={(val) => actualizarCampo('director', val)}
          errorMensaje={errores.director}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <CampoFormulario
          etiqueta="Año *"
          placeholder={`Ej. ${new Date().getFullYear()}`}
          value={formulario.anio.toString()}
          onChangeText={(val) => actualizarCampo('anio', parseInt(val, 10) || 0)}
          errorMensaje={errores.anio}
          keyboardType="number-pad"
          maxLength={4}
        />

        <CampoFormulario
          etiqueta="Sinopsis"
          placeholder="Breve descripción de la película..."
          value={formulario.sinopsis}
          onChangeText={(val) => actualizarCampo('sinopsis', val)}
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: 'top' }}
          ayuda="Opcional. Máx. 300 caracteres."
          maxLength={300}
        />

        {/* Selector de género */}
        <View style={estilos.seccion}>
          <Text style={estilos.etiquetaSeccion}>Género</Text>
          <View style={estilos.contenedorGeneros}>
            {GENEROS.map((genero) => (
              <TouchableOpacity
                key={genero}
                style={[
                  estilos.chipGenero,
                  formulario.genero === genero && estilos.chipGeneroActivo,
                ]}
                onPress={() => actualizarCampo('genero', genero)}
              >
                <Text
                  style={[
                    estilos.textoChip,
                    formulario.genero === genero && estilos.textoChipActivo,
                  ]}
                >
                  {genero}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selector de puntuación */}
        <View style={estilos.seccion}>
          <Text style={estilos.etiquetaSeccion}>Puntuación</Text>
          <View style={estilos.filaPuntuacion}>
            <TouchableOpacity
              style={estilos.botonPuntuacion}
              onPress={() => cambiarPuntuacion(-1)}
              disabled={formulario.puntuacion <= 1}
            >
              <Ionicons name="remove" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={estilos.valorPuntuacion}>
              <Ionicons name="star" size={20} color={Colors.star} />
              <Text style={estilos.textoPuntuacion}>{formulario.puntuacion}</Text>
              <Text style={estilos.textoPuntuacionMax}>/10</Text>
            </View>
            <TouchableOpacity
              style={estilos.botonPuntuacion}
              onPress={() => cambiarPuntuacion(1)}
              disabled={formulario.puntuacion >= 10}
            >
              <Ionicons name="add" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Switch vista/pendiente */}
        <View style={estilos.filaSwitch}>
          <View>
            <Text style={estilos.etiquetaSwitch}>Ya la vi</Text>
            <Text style={estilos.subetiquetaSwitch}>
              {formulario.vista ? 'Marcada como vista' : 'En la lista de pendientes'}
            </Text>
          </View>
          <Switch
            value={Boolean(formulario.vista)}
            onValueChange={(val) => actualizarCampo('vista', val ? 1 : 0)}
            trackColor={{ false: Colors.surfaceAlt, true: Colors.success }}
            thumbColor={Colors.textPrimary}
          />
        </View>

        {/* Botón guardar */}
        <TouchableOpacity
          style={[estilos.botonGuardar, cargando && estilos.botonDeshabilitado]}
          onPress={guardar}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={Colors.textPrimary} />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color={Colors.textPrimary} />
              <Text style={estilos.textoBoton}>Guardar película</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  seccion: {
    gap: 10,
  },
  etiquetaSeccion: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contenedorGeneros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipGenero: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipGeneroActivo: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.accent,
  },
  textoChip: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  textoChipActivo: {
    color: Colors.accent,
    fontWeight: '700',
  },
  filaPuntuacion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  botonPuntuacion: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valorPuntuacion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  textoPuntuacion: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  textoPuntuacionMax: {
    fontSize: 14,
    color: Colors.textMuted,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  filaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  etiquetaSwitch: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  subetiquetaSwitch: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  botonGuardar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});