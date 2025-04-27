import { ScrollView, useWindowDimensions, View } from "react-native";
import React, { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAppSelector } from "@/redux-toolkit/store";
import { Input, InputField } from "@/components/ui/input";
import TimezoneSelectionModal from "@/components/modals/TimezoneSelectionModal";
import {
  getCurrentTimezone,
  isValidTimeZone,
} from "@/utils/helpers/dateTimeHelpers";
import moment from "moment-timezone";
import {
  filterSlotsByRange,
  flattenSlots,
  groupSlotsByDate,
} from "@/utils/soltsHelpers/slotsGenerationHelpers";

import colors from "tailwindcss/colors";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ListFilter } from "lucide-react-native";

import SlotsList from "@/components/organisms/SlotsList//SlotsList";
import GroupedSlots from "@/components/organisms/GroupedSlots/GroupedSlots";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import SlotsFilteringForm from "@/components/forms/SlotsFilteringForm/SlotsFilteringForm";
import { SlotsFilterValues } from "@/components/forms/SlotsFilteringForm/schemes";

type ViewSlotsScreenParamsType = {
  timezone?: string;
};

type DisplayMode = "Compact" | "Expanded";
export default function Index() {
  const { timezone } = useLocalSearchParams<ViewSlotsScreenParamsType>();

  const getInitialTimezone = () => {
    if (timezone) {
      return isValidTimeZone(timezone) ? timezone : "";
    } else {
      const { timezone: currentDeviceTimeZone } = getCurrentTimezone();
      return currentDeviceTimeZone;
    }
  };

  const { slots } = useAppSelector((state) => state.slots);
  const [showTimezonesModal, setShowTimezonesModal] = useState(false);

  const [showDateRangeSelectionModal, setShowDateRangeSelectionModal] =
    useState(false);

  const [selectedTimezone, setSelectedTimezone] = useState(
    getInitialTimezone()
  );

  const [filterValues, setFilterValues] = useState<null | SlotsFilterValues>(
    null
  );
  const [slotsDisplayMode, setSlotsDisplayMode] =
    useState<DisplayMode>("Expanded");
  const toggleFilteringModalVisibility = () => {
    setShowDateRangeSelectionModal(!showDateRangeSelectionModal);
  };

  const upcomingSlotsByTimeZone = useMemo(() => {
    //passing empty strings will return all the upcoming slots
    const upcomingSlots = filterSlotsByRange(slots, "", "", selectedTimezone);
    const flatUpcomingSlots = flattenSlots(upcomingSlots);
    return flatUpcomingSlots;
  }, [selectedTimezone, slots]);

  //filter the slots resulting from filtering slots by timezone
  //filter them according to slots filtering values
  const filteredSlotsByFilterValues = useMemo(() => {
    if (!filterValues) {
      return upcomingSlotsByTimeZone;
    } else {
      const startDateRangeStr = `${filterValues.startDate} ${filterValues.startTime}`;
      const endDateRangeStr = `${filterValues.endDate} ${filterValues.endTime}`;
      const startRangeDate = moment.tz(
        startDateRangeStr,
        "YYYY-MM-DD HH:mm",
        selectedTimezone
      );
      const endRangeDate = moment.tz(
        endDateRangeStr,
        "YYYY-MM-DD HH:mm",
        selectedTimezone
      );
      const filteredSlotsByDateRange = upcomingSlotsByTimeZone.filter(
        (slot) => {
          const slotStartDateStr = `${slot.startDate} ${slot.startTime}`;
          const slotTimeZone = slot.timeZone;
          const slotStartDate = moment.tz(
            slotStartDateStr,
            "YYYY-MM-DD HH:mm",
            slotTimeZone
          );
          return slotStartDate.isBetween(
            startRangeDate,
            endRangeDate,
            undefined,
            "[]"
          );
        }
      );
      return filteredSlotsByDateRange;
    }
  }, [filterValues, upcomingSlotsByTimeZone]);

  const groupedSlotsByDay = useMemo(() => {
    return groupSlotsByDate(filteredSlotsByFilterValues);
  }, [filteredSlotsByFilterValues]);

  return (
    <View className="flex flex-1 items-center bg-white">
      {/* Slots filtering form bottom sheet */}
      <SlotsFilteringForm
        onReset={() => {
          setFilterValues(null);
          toggleFilteringModalVisibility();
        }}
        isOpen={showDateRangeSelectionModal}
        onClose={toggleFilteringModalVisibility}
        onSubmitFilteringForm={(formValues) => {
          setFilterValues(formValues);
          toggleFilteringModalVisibility();
        }}
      />
      {/*timeZone selection modal */}
      <TimezoneSelectionModal
        onReset={() => {
          setSelectedTimezone(getInitialTimezone());
        }}
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
      {/*toggle the display mode whether grouped by day or expanded */}
      <HStack className="w-[95%] mt-4 justify-end items-center" space="sm">
        <Text size="md">Expand all slots</Text>
        <Switch
          size="md"
          value={slotsDisplayMode === "Expanded"}
          onValueChange={(newValue) => {
            setSlotsDisplayMode(newValue ? "Expanded" : "Compact");
          }}
          trackColor={{ false: colors.neutral[300], true: colors.neutral[600] }}
          thumbColor={colors.neutral[50]}
          ios_backgroundColor={colors.neutral[300]}
        />
      </HStack>
      {/*timeZone input and filtering button HStack */}
      <HStack className="w-[95%] mt-4" space="md">
        <Input className="flex flex-1" size="lg">
          <InputField
            showSoftInputOnFocus={false}
            placeholder="Select timezone"
            value={selectedTimezone}
            onPressIn={() => {
              setShowTimezonesModal(true);
            }}
          />
        </Input>
        <Button onPress={toggleFilteringModalVisibility}>
          <ButtonIcon as={ListFilter} />
        </Button>
      </HStack>

      {/* if the display mode is expanded, display flat slot list */}
      {slotsDisplayMode == "Expanded" && (
        <SlotsList
          data={filteredSlotsByFilterValues}
          selectedTimeZone={selectedTimezone}
        />
      )}
      {/* if the display mode is compact, display slots grouped by daty */}

      {slotsDisplayMode == "Compact" && (
        <ScrollView contentContainerClassName="w-full flex-grow">
          <GroupedSlots
            groupedSlots={groupedSlotsByDay}
            selectedTimeZone={selectedTimezone}
          />
        </ScrollView>
      )}
    </View>
  );
}
