import { Slot } from "@/utils/helpers/mmkvHelpers";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";

import { Alert as RNAlert, useWindowDimensions } from "react-native";
import { Button, ButtonText } from "../../ui/button";
import { useAppDispatch } from "@/redux-toolkit/store";
import { deleteSlot } from "@/redux-toolkit/slices/slotsSlice";
import moment from "moment-timezone";
import { useMemo } from "react";
import { InfoIcon } from "lucide-react-native";
import React from "react";

type Props = {
  slotItem: Slot;
  selectedTimeZone: string;
};

const SlotItemComponent: React.FC<Props> = ({ slotItem, selectedTimeZone }) => {
  const {
    startDate,
    endDate,
    startTime,
    endTime,
    timeZone,
    breakDuration,
    slotDuration,
    bufferDuration,
  } = slotItem;
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();

  const onDeleteSlot = () => {
    dispatch(deleteSlot({ slotUid: slotItem.uid }));
  };

  const canBeBooked = useMemo(() => {
    const now = moment.tz(selectedTimeZone);
    const slotStartDateStr = `${slotItem.startDate} ${slotItem.startTime}`;
    const slotStartDate = moment.tz(
      slotStartDateStr,
      "YYYY-MM-DD HH:mm",
      slotItem.timeZone
    );

    const lastPossibleBookTime = slotStartDate
      .clone()
      .subtract(slotItem.bufferDuration, "minutes");

    return now.isSameOrBefore(lastPossibleBookTime);
  }, [slotItem, selectedTimeZone]);

  const startDateStr = `${startDate} ${startTime}`;
  const endDateStr = `${endDate} ${endTime}`;

  const startDateMoment = moment.tz(startDateStr, timeZone);
  const endDateMoment = moment.tz(endDateStr, timeZone);

  const startTimeWithTimeZone = moment
    .tz(startDateMoment, selectedTimeZone)
    .format("HH:mm");

  const endTimeWithTimeZone = moment
    .tz(endDateMoment, selectedTimeZone)
    .format("HH:mm");

  const onBookSlot = () => {
    RNAlert.alert("Slot has been booked successfully");
  };

  return (
    <Box
      style={{
        width: width * 0.95,
      }}
      className="border border-gray-300 rounded-md p-4 mb-3 bg-white"
    >
      <VStack space="md">
        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">Start Date: </Text>
          <Text className="text-md">{startDate}</Text>
        </HStack>

        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">End Date: </Text>
          <Text className="text-md">{endDate}</Text>
        </HStack>

        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">Start Time: </Text>
          <Text className="text-md">{startTimeWithTimeZone}</Text>
        </HStack>

        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">End Time: </Text>
          <Text className="text-md">{endTimeWithTimeZone}</Text>
        </HStack>

        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">Time Zone: </Text>
          <Text className="text-md">{selectedTimeZone}</Text>
        </HStack>

        <Divider className="my-2" />

        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">Slot Duration: </Text>
          <Text className="text-md">{slotDuration}</Text>
        </HStack>

        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">Break Duration: </Text>
          <Text className="text-md">{breakDuration}</Text>
        </HStack>

        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">Buffer Duration: </Text>
          <Text className="text-md">{bufferDuration}</Text>
        </HStack>

        {!canBeBooked && (
          <Alert className="px-6" action="info" variant="solid">
            <AlertIcon as={InfoIcon} />
            <AlertText>
              Slot can be booked before it's start time by at least{" "}
              {slotItem.bufferDuration} minutes!
            </AlertText>
          </Alert>
        )}

        <HStack className="justify-end items-center mt-4" space="sm">
          <Button
            size="md"
            variant="solid"
            action="negative"
            onPress={onDeleteSlot}
          >
            <ButtonText>Delete!</ButtonText>
          </Button>
          <Button
            size="md"
            variant="solid"
            action="primary"
            onPress={onBookSlot}
            disabled={!canBeBooked}
          >
            <ButtonText>Book!</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const SlotItem = React.memo(SlotItemComponent);

export default SlotItem;
