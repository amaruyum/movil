/**
 * MovieCard.tsx
 * Componente reutilizable que representa una película en forma de tarjeta.
 * Se usa en la pantalla de listado y en la vista de edición.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Pelicula } from '../database/database';

// ── Subcomponente: puntuación con estrella ───

interface EstrellasPuntuacionProps {
  puntuacion: number;
}

/**
 * EstrellasPuntuacion
 * Muestra la puntuación numérica con un icono de estrella dorada.
 */
const EstrellasPuntuacion: React.FC<EstrellasPuntuacionProps> = ({ puntuacion }) => (
  <View style={estilos.filaPuntuacion}>
    <Ionicons name="star" size={14} color={Colors.star} />
    <Text style={estilos.textoPuntuacion}>{puntuacion.toFixed(1)}</Text>
    <Text style={estilos.textoPuntuacionMax}>/10</Text>
  </View>
);

// ── Props del componente principal ───────────

interface MovieCardProps {
  pelicula: Pelicula;
  onPressar: (pelicula: Pelicula) => void;
  onEliminar: (id: number) => void;
  modoCompacto?: boolean;
}

/**
 * MovieCard
 * Tarjeta visual que muestra la información de una película.
 * Incluye chip de género, estado (vista/pendiente) y puntuación.
 */
const MovieCard: React.FC<MovieCardProps> = ({
  pelicula,
  onPressar,
  onEliminar,
  modoCompacto = false,
}) => {
  /**
   * Muestra un diálogo de confirmación antes de borrar.
   */
  const confirmarEliminacion = (): void => {
    Alert.alert(
      'Eliminar película',
      `¿Seguro que quieres eliminar "${pelicula.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onEliminar(pelicula.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={estilos.tarjeta}
      onPress={() => onPressar(pelicula)}
      activeOpacity={0.85}
    >
      {/* Franja lateral según estado de visionado */}
      <View
        style={[
          estilos.franjaLateral,
          { backgroundColor: pelicula.vista ? Colors.success : Colors.textMuted },
        ]}
      />

      <View style={estilos.contenido}>
        {/* Cabecera: título + botón borrar */}
        <View style={estilos.cabecera}>
          <Text style={estilos.titulo} numberOfLines={1}>
            {pelicula.titulo}
          </Text>
          <TouchableOpacity
            onPress={confirmarEliminacion}
            style={estilos.botonEliminar}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>

        {/* Director y año */}
        <Text style={estilos.director}>
          {pelicula.director} · {pelicula.anio}
        </Text>

        {/* Chips de género, estado y puntuación */}
        <View style={estilos.filaMeta}>
          <View style={estilos.chipGenero}>
            <Text style={estilos.textoChip}>{pelicula.genero}</Text>
          </View>

          <View
            style={[
              estilos.chipEstado,
              {
                backgroundColor: pelicula.vista
                  ? Colors.success + '33'
                  : Colors.accentMuted,
              },
            ]}
          >
            <Ionicons
              name={pelicula.vista ? 'checkmark-circle' : 'time-outline'}
              size={12}
              color={pelicula.vista ? Colors.success : Colors.accent}
            />
            <Text
              style={[
                estilos.textoChip,
                { color: pelicula.vista ? Colors.success : Colors.accent },
              ]}
            >
              {pelicula.vista ? 'Vista' : 'Pendiente'}
            </Text>
          </View>

          <EstrellasPuntuacion puntuacion={pelicula.puntuacion} />
        </View>

        {/* Sinopsis (solo en modo completo) */}
        {!modoCompacto && pelicula.sinopsis ? (
          <Text style={estilos.sinopsis} numberOfLines={2}>
            {pelicula.sinopsis}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  franjaLateral: {
    width: 4,
  },
  contenido: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  botonEliminar: {
    padding: 4,
  },
  director: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  filaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  chipGenero: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  textoChip: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filaPuntuacion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 'auto',
  },
  textoPuntuacion: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.star,
  },
  textoPuntuacionMax: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  sinopsis: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginTop: 4,
  },
});

export default MovieCard;