/**
 * CampoFormulario.tsx
 * Componente reutilizable para campos de texto en formularios.
 * Se usa en las pantallas de Crear y Editar película.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface CampoFormularioProps extends TextInputProps {
  etiqueta: string;
  errorMensaje?: string;
  ayuda?: string;
}

/**
 * CampoFormulario
 * Wrapper de TextInput con etiqueta, borde de foco dinámico
 * y mensajes de validación.
 */
const CampoFormulario: React.FC<CampoFormularioProps> = ({
  etiqueta,
  errorMensaje,
  ayuda,
  style,
  ...inputProps
}) => {
  const [enfocado, setEnfocado] = useState(false);

  const colorBorde = errorMensaje
    ? Colors.error
    : enfocado
    ? Colors.borderFocus
    : Colors.border;

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={[estilos.input, { borderColor: colorBorde }, style]}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        {...inputProps}
      />
      {errorMensaje ? (
        <Text style={estilos.textoError}>{errorMensaje}</Text>
      ) : null}
      {!errorMensaje && ayuda ? (
        <Text style={estilos.textoAyuda}>{ayuda}</Text>
      ) : null}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    gap: 6,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  textoError: {
    fontSize: 12,
    color: Colors.error,
  },
  textoAyuda: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});

export default CampoFormulario;