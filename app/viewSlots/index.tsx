import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Slot, useLocalSearchParams } from "expo-router";
import { useAppSelector } from "@/redux-toolkit/store";
import { Input, InputField } from "@/components/ui/input";
import TimezoneSelectionModal from "@/components/modals/TimezoneSelectionModal";
import SlotItem from "@/components/atoms/SlotItem";

import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import {
  createISOString,
  isValidTimeZone,
} from "@/utils/helpers/dateTimeHelpers";
import moment from "moment-timezone";

type ViewSlotsScreenParamsType = {
  timezone?: string;
};
export default function Index() {
  const { timezone } = useLocalSearchParams<ViewSlotsScreenParamsType>();
  const getInitialTimezone = () => {
    if (timezone) {
      return isValidTimeZone(timezone) ? timezone : "";
    } else {
      return "";
    }
  };
  const { width } = useWindowDimensions();
  const { slots } = useAppSelector((state) => state.slots);
  const [showTimezonesModal, setShowTimezonesModal] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(
    getInitialTimezone()
  );

  const filteredTimezones = useMemo(() => {
    const now = moment();

    const upcomingSlots = slots.filter((slot) => {
      const isoDateString = createISOString(
        slot.startDate,
        slot.startTime,
        slot.timeZone
      );
      const slotMoment = moment(isoDateString);

      return slotMoment.isSameOrAfter(now);
    });
    if (selectedTimezone.trim().length === 0) {
      return upcomingSlots;
    } else {
      return upcomingSlots.filter((slot) => slot.timeZone === selectedTimezone);
    }
  }, [slots, selectedTimezone]);
  return (
    <View className="flex flex-1 items-center bg-white">
      <TimezoneSelectionModal
        onChangeTimezone={(v) => {
          setSelectedTimezone(v);
          setShowTimezonesModal(false);
        }}
        onClose={() => {
          setShowTimezonesModal(false);
        }}
        selectedTimezone={selectedTimezone}
        visible={showTimezonesModal}
      />
      <Input className="w-[95%] mt-4" size="lg">
        <InputField
          showSoftInputOnFocus={false}
          placeholder="Select timezone"
          value={selectedTimezone}
          onPressIn={() => {
            setShowTimezonesModal(true);
          }}
        />
      </Input>

      <FlatList
        ListEmptyComponent={() => {
          return (
            <Center className="flex flex-1">
              <Text>There is no avilable slots for this timezone</Text>
            </Center>
          );
        }}
        data={filteredTimezones}
        keyExtractor={(item) => item.uid}
        contentContainerClassName="py-4"
        contentContainerStyle={[styles.listContainerStyle, { width }]}
        renderItem={({ item }) => {
          return <SlotItem slotItem={item} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainerStyle: {
    alignItems: "center",
    flexGrow: 1,
  },
});
