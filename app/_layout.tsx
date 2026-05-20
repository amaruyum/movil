/**
 * app/_layout.tsx
 * Layout raíz de la aplicación.
 * Inicializa SQLite y configura el Stack Navigator principal.
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { inicializarBaseDatos } from '../database/database';
import { Colors } from '../constants/Colors';

/**
 * RootLayout
 * Espera a que la BD esté lista antes de renderizar la navegación.
 */
export default function RootLayout() {
  const [bdLista, setBdLista] = useState(false);

  useEffect(() => {
    inicializarBaseDatos()
      .then(() => setBdLista(true))
      .catch((err) => {
        console.error('[RootLayout] Error al inicializar BD:', err);
        setBdLista(true);
      });
  }, []);

  if (!bdLista) {
    return (
      <View style={estilos.contenedorCarga}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="movie/nueva"
          options={{
            title: 'Nueva Película',
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="movie/[id]"
          options={{ title: 'Editar Película' }}
        />
      </Stack>
    </>
  );
}

const estilos = StyleSheet.create({
  contenedorCarga: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});