import { Slot } from "@/utils/helpers/mmkvHelpers";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContent,
  AccordionContentText,
  AccordionIcon,
} from "@/components/ui/accordion";
import SlotsList from "../SlotsList/SlotsList";
import { VStack } from "@/components/ui/vstack/index.web";
import { Text } from "@/components/ui/text";
import SlotItem from "../SlotsList/SlotItem";
import React from "react"; // make sure React is imported

type Props = {
  groupHeaderName: string;
  groupSlots: Slot[];
  selectedTimeZone: string;
};

const GroupItemComponent: React.FC<Props> = ({
  groupHeaderName,
  groupSlots,
  selectedTimeZone,
}) => {
  return (
    <Accordion
      size="md"
      variant="filled"
      type="multiple"
      isCollapsible={true}
      isDisabled={false}
      className="w-full"
    >
      <AccordionItem value={groupHeaderName}>
        <AccordionHeader>
          <AccordionTrigger>
            {({ isExpanded }) => {
              return (
                <>
                  <AccordionTitleText>{groupHeaderName}</AccordionTitleText>
                  {isExpanded ? (
                    <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                  ) : (
                    <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                  )}
                </>
              );
            }}
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent className="px-0 items-center">
          {/* NativeBase Accordion component does not support scrolling oyt of the box so here i am using the basic map function instead of flatlist */}
          {groupSlots.map((slot) => {
            return (
              <SlotItem
                key={slot.uid}
                slotItem={slot}
                selectedTimeZone={selectedTimeZone}
              />
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const GroupItem = React.memo(GroupItemComponent);

export default GroupItem;
