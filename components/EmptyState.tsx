/**
 * EmptyState.tsx
 * Componente reutilizable para mostrar un estado vacío con icono y mensaje.
 * Se usa en la pantalla de listado y en la pantalla de estadísticas.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface EmptyStateProps {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  subtitulo?: string;
  accion?: string;
  onAccion?: () => void;
}

/**
 * EmptyState
 * Muestra un mensaje visual cuando una lista está vacía o no hay resultados.
 * Admite un botón de acción opcional para guiar al usuario.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icono,
  titulo,
  subtitulo,
  accion,
  onAccion,
}) => (
  <View style={estilos.contenedor}>
    <View style={estilos.circuloIcono}>
      <Ionicons name={icono} size={48} color={Colors.accent} />
    </View>
    <Text style={estilos.titulo}>{titulo}</Text>
    {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
    {accion && onAccion ? (
      <TouchableOpacity style={estilos.boton} onPress={onAccion}>
        <Text style={estilos.textoBoton}>{accion}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  circuloIcono: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  boton: {
    marginTop: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  textoBoton: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default EmptyState;