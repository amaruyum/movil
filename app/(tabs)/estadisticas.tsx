/**
 * app/(tabs)/estadisticas.tsx
 * Pantalla de estadísticas: resumen visual de la colección de películas.
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { usePeliculas } from '../../hooks/usePeliculas';
import EmptyState from '../../components/EmptyState';

// ── Subcomponente: Tarjeta de estadística ────

interface TarjetaStatProps {
  icono: keyof typeof Ionicons.glyphMap;
  valor: string | number;
  etiqueta: string;
  colorIcono?: string;
}

/**
 * TarjetaStat
 * Muestra un único indicador estadístico con icono, valor y etiqueta.
 */
const TarjetaStat: React.FC<TarjetaStatProps> = ({
  icono,
  valor,
  etiqueta,
  colorIcono = Colors.accent,
}) => (
  <View style={estilos.tarjetaStat}>
    <Ionicons name={icono} size={28} color={colorIcono} />
    <Text style={estilos.valorStat}>{valor}</Text>
    <Text style={estilos.etiquetaStat}>{etiqueta}</Text>
  </View>
);

// ── Pantalla principal ───────────────────────

/**
 * PantallaEstadisticas
 * Calcula y muestra métricas derivadas de la colección de películas.
 */
export default function PantallaEstadisticas() {
  const { peliculas, cargando, recargarPeliculas } = usePeliculas();

  useFocusEffect(
    useCallback(() => {
      recargarPeliculas();
    }, [recargarPeliculas])
  );

  const totalPeliculas = peliculas.length;
  const peliculasVistas = peliculas.filter((p) => p.vista).length;
  const peliculasPendientes = totalPeliculas - peliculasVistas;

  const puntuacionMedia =
    totalPeliculas > 0
      ? (peliculas.reduce((sum, p) => sum + p.puntuacion, 0) / totalPeliculas).toFixed(1)
      : '—';

  const distribucionGeneros = peliculas.reduce<Record<string, number>>(
    (acc, p) => {
      acc[p.genero] = (acc[p.genero] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const generosOrdenados = Object.entries(distribucionGeneros).sort(
    ([, a], [, b]) => b - a
  );

  const directorFrecuente = (() => {
    const conteo = peliculas.reduce<Record<string, number>>((acc, p) => {
      acc[p.director] = (acc[p.director] ?? 0) + 1;
      return acc;
    }, {});
    const [director] = Object.entries(conteo).sort(([, a], [, b]) => b - a)[0] ?? [];
    return director ?? '—';
  })();

  if (totalPeliculas === 0) {
    return (
      <View style={estilos.contenedor}>
        <EmptyState
          icono="bar-chart-outline"
          titulo="Sin estadísticas aún"
          subtitulo="Añade películas a tu colección para ver los datos aquí."
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      refreshControl={
        <RefreshControl
          refreshing={cargando}
          onRefresh={recargarPeliculas}
          tintColor={Colors.accent}
        />
      }
    >
      <Text style={estilos.seccionTitulo}>Resumen</Text>
      <View style={estilos.filaStats}>
        <TarjetaStat icono="film-outline" valor={totalPeliculas} etiqueta="Total" />
        <TarjetaStat
          icono="checkmark-circle-outline"
          valor={peliculasVistas}
          etiqueta="Vistas"
          colorIcono={Colors.success}
        />
        <TarjetaStat
          icono="time-outline"
          valor={peliculasPendientes}
          etiqueta="Pendientes"
          colorIcono={Colors.warning}
        />
      </View>

      <View style={estilos.tarjetaDestacada}>
        <Ionicons name="star" size={32} color={Colors.star} />
        <View>
          <Text style={estilos.valorDestacado}>{puntuacionMedia}</Text>
          <Text style={estilos.etiquetaDestacada}>Puntuación media / 10</Text>
        </View>
      </View>

      <View style={estilos.tarjetaDestacada}>
        <Ionicons name="person-outline" size={32} color={Colors.accent} />
        <View style={estilos.columnaDestacada}>
          <Text style={estilos.valorDestacado} numberOfLines={1}>
            {directorFrecuente}
          </Text>
          <Text style={estilos.etiquetaDestacada}>Director más frecuente</Text>
        </View>
      </View>

      <Text style={estilos.seccionTitulo}>Distribución por géneros</Text>
      {generosOrdenados.map(([genero, conteo]) => {
        const porcentaje = Math.round((conteo / totalPeliculas) * 100);
        return (
          <View key={genero} style={estilos.filaGenero}>
            <Text style={estilos.textoGenero}>{genero}</Text>
            <View style={estilos.barraContenedor}>
              <View style={[estilos.barraRelleno, { width: `${porcentaje}%` }]} />
            </View>
            <Text style={estilos.textoCantidad}>{conteo} ({porcentaje}%)</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  seccionTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 4,
  },
  filaStats: {
    flexDirection: 'row',
    gap: 12,
  },
  tarjetaStat: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  valorStat: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  etiquetaStat: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tarjetaDestacada: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  columnaDestacada: {
    flex: 1,
  },
  valorDestacado: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  etiquetaDestacada: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filaGenero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textoGenero: {
    width: 110,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  barraContenedor: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraRelleno: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  textoCantidad: {
    width: 70,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
});