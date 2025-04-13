import { Stack } from "expo-router";
import "react-native-get-random-values";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Provider } from "react-redux";
import { store } from "../redux-toolkit/store";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <GluestackUIProvider mode="light">
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "Home",
            }}
          />
          <Stack.Screen
            name="createSlots/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="viewSlots/index"
            options={{
              headerTitle: "Available slots",
            }}
          />
        </Stack>
      </GluestackUIProvider>
    </Provider>
  );
}
