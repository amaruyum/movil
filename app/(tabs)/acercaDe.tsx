/**
 * app/(tabs)/acercaDe.tsx
 * Pantalla "Acerca de": información de la aplicación y tecnologías usadas.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

// ── Subcomponente: Fila de tecnología ────────

interface FilaTecnologiaProps {
  icono: keyof typeof Ionicons.glyphMap;
  nombre: string;
  descripcion: string;
}

/**
 * FilaTecnologia
 * Muestra una tecnología usada en el proyecto con icono y descripción.
 */
const FilaTecnologia: React.FC<FilaTecnologiaProps> = ({
  icono,
  nombre,
  descripcion,
}) => (
  <View style={estilos.filaTech}>
    <View style={estilos.iconoTech}>
      <Ionicons name={icono} size={20} color={Colors.accent} />
    </View>
    <View style={estilos.textosTech}>
      <Text style={estilos.nombreTech}>{nombre}</Text>
      <Text style={estilos.descTech}>{descripcion}</Text>
    </View>
  </View>
);

// ── Pantalla ─────────────────────────────────

/**
 * PantallaAcercaDe
 * Muestra información sobre la aplicación, tecnologías y créditos.
 */
export default function PantallaAcercaDe() {
  const abrirDocumentacion = (): void => {
    Linking.openURL('https://expo.dev/router');
  };

  const tecnologias: FilaTecnologiaProps[] = [
    {
      icono: 'phone-portrait-outline',
      nombre: 'React Native + Expo',
      descripcion: 'Framework multiplataforma para iOS, Android y Web',
    },
    {
      icono: 'navigate-outline',
      nombre: 'Expo Router',
      descripcion: 'Navegación basada en sistema de archivos (Stack + Tabs)',
    },
    {
      icono: 'server-outline',
      nombre: 'SQLite (expo-sqlite)',
      descripcion: 'Base de datos local para persistencia de datos',
    },
    {
      icono: 'code-slash-outline',
      nombre: 'TypeScript',
      descripcion: 'Tipado estático para mayor robustez del código',
    },
    {
      icono: 'shapes-outline',
      nombre: 'Ionicons',
      descripcion: 'Librería de iconos de @expo/vector-icons',
    },
  ];

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabecera */}
      <View style={estilos.cabecera}>
        <View style={estilos.logoContenedor}>
          <Ionicons name="film" size={48} color={Colors.accent} />
        </View>
        <Text style={estilos.nombreApp}>listCine</Text>
        <Text style={estilos.versionApp}>Versión 1.0.0</Text>
        <Text style={estilos.descripcionApp}>
          Tu colección personal de películas. Guarda, organiza y valora
          todo lo que has visto y lo que quieres ver.
        </Text>
      </View>

      {/* Características */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Características</Text>
        {[
          '🎬 Añade y edita películas fácilmente',
          '⭐ Puntúa y marca como vista / pendiente',
          '🔍 Búsqueda por título o director',
          '📊 Estadísticas de tu colección',
          '💾 Datos guardados localmente en tu dispositivo',
        ].map((item) => (
          <Text key={item} style={estilos.itemCaracteristica}>
            {item}
          </Text>
        ))}
      </View>

      {/* Tecnologías */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Tecnologías</Text>
        {tecnologias.map((tech) => (
          <FilaTecnologia key={tech.nombre} {...tech} />
        ))}
      </View>

      {/* Arquitectura */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Arquitectura</Text>
        <View style={estilos.tarjetaArq}>
          <Text style={estilos.textoArq}>
            La app sigue una arquitectura modular basada en:{'\n\n'}
            <Text style={estilos.textoArqNegrita}>• Custom Hook </Text>
            (usePeliculas) — gestión del estado y lógica de negocio{'\n\n'}
            <Text style={estilos.textoArqNegrita}>• Componentes reutilizables </Text>
            — MovieCard, EmptyState, CampoFormulario{'\n\n'}
            <Text style={estilos.textoArqNegrita}>• Módulo de BD </Text>
            (database.ts) — acceso centralizado a SQLite
          </Text>
        </View>
      </View>

      {/* Créditos */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Créditos</Text>
        <Text style={estilos.textoCreditos}>
          Desarrollado como actividad académica del módulo de{'\n'}
          <Text style={{ color: Colors.accent }}>Desarrollo de Interfaces</Text>
          {'\n\n'}© 2024 — Todos los derechos reservados
        </Text>
      </View>

      {/* Botón documentación */}
      <TouchableOpacity style={estilos.botonDocs} onPress={abrirDocumentacion}>
        <Ionicons name="open-outline" size={16} color={Colors.textPrimary} />
        <Text style={estilos.textoBotonDocs}>Ver documentación de Expo Router</Text>
      </TouchableOpacity>
    </ScrollView>
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
    gap: 24,
  },
  cabecera: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  logoContenedor: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nombreApp: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  versionApp: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  descripcionApp: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  seccion: {
    gap: 12,
  },
  tituloSeccion: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemCaracteristica: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  filaTech: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconoTech: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textosTech: {
    flex: 1,
    gap: 2,
  },
  nombreTech: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  descTech: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tarjetaArq: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  textoArq: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  textoArqNegrita: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  textoCreditos: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  botonDocs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textoBotonDocs: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});