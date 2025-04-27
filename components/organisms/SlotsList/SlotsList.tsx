import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Slot } from "@/utils/helpers/mmkvHelpers";
import { StyleSheet, useWindowDimensions } from "react-native";
import { FlatList } from "react-native";
import SlotItem from "./SlotItem";
import React from "react"; // make sure React is imported

type Props = {
  data: Array<Slot>;
  selectedTimeZone: string;
};

const SlotsListComponent: React.FC<Props> = ({ data, selectedTimeZone }) => {
  return (
    <FlatList
      scrollEnabled={true}
      ListEmptyComponent={() => (
        <Center className="flex flex-1">
          <Text>There are no available slots for this timezone</Text>
        </Center>
      )}
      data={data}
      keyExtractor={(item) => item.uid}
      contentContainerClassName="py-4"
      contentContainerStyle={[styles.listContainerStyle, { width: "100%" }]}
      renderItem={({ item }) => (
        <SlotItem slotItem={item} selectedTimeZone={selectedTimeZone} />
      )}
    />
  );
};

const SlotsList = React.memo(SlotsListComponent);

const styles = StyleSheet.create({
  listContainerStyle: {
    alignItems: "center",
    flexGrow: 1,
  },
});

export default SlotsList;
