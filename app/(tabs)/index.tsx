/**
 * app/(tabs)/index.tsx
 * Pantalla principal: listado de películas con búsqueda en tiempo real.
 */

import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { usePeliculas } from '../../hooks/usePeliculas';
import MovieCard from '../../components/MovieCard';
import EmptyState from '../../components/EmptyState';
import { Pelicula } from '../../database/database';

/**
 * PantallaListado
 * Muestra la colección completa de películas del usuario.
 * Se recarga automáticamente al volver a enfocar la pantalla.
 */
export default function PantallaListado() {
  const router = useRouter();
  const {
    peliculas,
    cargando,
    textoBusqueda,
    buscar,
    limpiarBusqueda,
    borrarPelicula,
    recargarPeliculas,
  } = usePeliculas();

  // Recargar al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      recargarPeliculas();
    }, [recargarPeliculas])
  );

  // ── Handlers ────────────────────────────────

  const handlePresarTarjeta = (pelicula: Pelicula): void => {
    router.push(`/movie/${pelicula.id}`);
  };

  const handleEliminar = (id: number): void => {
    borrarPelicula(id);
  };

  const handleNuevaPelicula = (): void => {
    router.push('/movie/nueva');
  };

  // ── Cabecera de la lista ─────────────────────

  const renderCabecera = () => (
    <View style={estilos.cabecera}>
      <View style={estilos.contenedorBusqueda}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput
          style={estilos.inputBusqueda}
          placeholder="Buscar por título o director..."
          placeholderTextColor={Colors.textMuted}
          value={textoBusqueda}
          onChangeText={buscar}
        />
        {textoBusqueda.length > 0 && (
          <TouchableOpacity onPress={limpiarBusqueda}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={estilos.textoContador}>
        {peliculas.length}{' '}
        {peliculas.length === 1 ? 'película' : 'películas'}
        {textoBusqueda ? ` para "${textoBusqueda}"` : ''}
      </Text>
    </View>
  );

  // ── Render ───────────────────────────────────

  return (
    <View style={estilos.contenedor}>
      {cargando && peliculas.length === 0 ? (
        <ActivityIndicator
          size="large"
          color={Colors.accent}
          style={estilos.indicadorCarga}
        />
      ) : (
        <FlatList
          data={peliculas}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderCabecera}
          ListEmptyComponent={
            <EmptyState
              icono={textoBusqueda ? 'search-outline' : 'film-outline'}
              titulo={
                textoBusqueda ? 'Sin resultados' : '¡Tu lista está vacía!'
              }
              subtitulo={
                textoBusqueda
                  ? `No encontramos películas para "${textoBusqueda}".`
                  : 'Pulsa el botón + para añadir tu primera película.'
              }
              accion={textoBusqueda ? 'Limpiar búsqueda' : 'Añadir película'}
              onAccion={textoBusqueda ? limpiarBusqueda : handleNuevaPelicula}
            />
          }
          renderItem={({ item }) => (
            <MovieCard
              pelicula={item}
              onPressar={handlePresarTarjeta}
              onEliminar={handleEliminar}
            />
          )}
          contentContainerStyle={[
            estilos.listaContenido,
            peliculas.length === 0 && estilos.listaVacia,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={cargando}
              onRefresh={recargarPeliculas}
              tintColor={Colors.accent}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Botón flotante para añadir película */}
      <TouchableOpacity style={estilos.fab} onPress={handleNuevaPelicula}>
        <Ionicons name="add" size={28} color={Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  indicadorCarga: {
    flex: 1,
  },
  cabecera: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  contenedorBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputBusqueda: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  textoContador: {
    fontSize: 13,
    color: Colors.textMuted,
    paddingHorizontal: 4,
  },
  listaContenido: {
    paddingBottom: 100,
  },
  listaVacia: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
});