import { GroupedSlotsType } from "@/utils/soltsHelpers/slotsGenerationHelpers";
import GroupItem from "./GroupItem";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import React from "react"; // make sure React is imported

type Props = {
  groupedSlots: GroupedSlotsType;
  selectedTimeZone: string;
};

const GroupedSlotsComponent: React.FC<Props> = ({
  groupedSlots,
  selectedTimeZone,
}) => {
  const entries = Object.entries(groupedSlots);

  //empty view
  if (entries.length === 0) {
    return (
      <Center className="flex flex-1">
        <Text>There are no available slots for this timezone</Text>
      </Center>
    );
  }

  return entries.map(([key, value]) => (
    <GroupItem
      groupHeaderName={key}
      groupSlots={value}
      key={key}
      selectedTimeZone={selectedTimeZone}
    />
  ));
};

const GroupedSlots = React.memo(GroupedSlotsComponent);

export default GroupedSlots;
