import { useEffect } from 'react';
import { DarkTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { BigShouldersDisplay_700Bold, BigShouldersDisplay_900Black } from '@expo-google-fonts/big-shoulders-display';
import { IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold, useFonts } from '@expo-google-fonts/ibm-plex-sans';

import { JogoProvider } from '@/game/estado';
import { prepararSons } from '@/sons';
import { cor } from '@/theme';

SplashScreen.preventAutoHideAsync();

// O fundo do navegador aparece por trás das telas durante as transições.
// No tema padrão ele é quase branco e "pisca" ao voltar; aqui ele usa a cor da mesa.
const tema: Theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: cor.mesa, card: cor.mesaEscura, text: cor.formulario },
};

export default function RootLayout() {
  const [carregou, erro] = useFonts({
    BigShouldersDisplay_700Bold,
    BigShouldersDisplay_900Black,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
  });

  useEffect(() => {
    if (carregou || erro) SplashScreen.hideAsync();
  }, [carregou, erro]);

  useEffect(() => {
    prepararSons();
  }, []);

  if (!carregou && !erro) return null;

  return (
    <ThemeProvider value={tema}>
      <JogoProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: cor.mesa },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="email/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="ligacao/[id]" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="desligado" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
          <Stack.Screen name="concluido" options={{ gestureEnabled: false }} />
        </Stack>
      </JogoProvider>
    </ThemeProvider>
  );
}
