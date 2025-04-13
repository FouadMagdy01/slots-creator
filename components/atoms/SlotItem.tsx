import { Slot } from "@/utils/helpers/mmkvHelpers";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { useWindowDimensions } from "react-native";
import { Button, ButtonText } from "../ui/button";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/redux-toolkit/store";
import { deleteSlot } from "@/redux-toolkit/slices/slotsSlice";

type Props = {
  slotItem: Slot;
};

const SlotItem: React.FC<Props> = ({ slotItem }) => {
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
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onDeleteSlot = () => {
    dispatch(deleteSlot({ slotUid: slotItem.uid }));
  };
  const onEditSlot = () => {
    router.push({
      pathname: "/createSlots",
      params: {
        slotUid: slotItem.uid,
      },
    });
  };
  return (
    <Box
      style={{
        width: width * 0.95,
      }}
      className=" border border-gray-300 rounded-md p-4 mb-3 bg-white"
    >
      <VStack className="space-y-2">
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
          <Text className="text-md">{startTime}</Text>
        </HStack>

        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">End Time: </Text>
          <Text className="text-md">{endTime}</Text>
        </HStack>

        <HStack className="justify-between items-center">
          <Text className="text-md font-bold">Time Zone: </Text>
          <Text className="text-md">{timeZone}</Text>
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
            action="secondary"
            onPress={onEditSlot}
          >
            <ButtonText>Edit!</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SlotItem;
