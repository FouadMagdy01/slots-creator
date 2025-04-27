import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";

import { useLocalSearchParams, useNavigation } from "expo-router";
import CreateSlotsForm from "@/components/forms/SlotsCreationForm/SlotsCreationForm";
type CreatelotsScreenParamsType = {
  slotUid?: string;
};
export default function Index() {
  const { slotUid } = useLocalSearchParams<CreatelotsScreenParamsType>();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: slotUid ? "Edit Slot" : "Add Slot",
      headerShown: true,
    });
  }, []);
  return (
    <ScrollView contentContainerClassName="grow items-center bg-white">
      <CreateSlotsForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
