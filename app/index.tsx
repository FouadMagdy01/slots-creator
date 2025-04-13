import { Text } from "react-native";
import { Link } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

export default function Index() {
  return (
    <Box className="flex-1 px-4 py-6 bg-white">
      {/* Header section */}
      <Box className="mb-8">
        <Heading className="text-2xl mb-2">Slot Manager</Heading>
        <Text className="text-base">Manage your time efficiently</Text>
      </Box>

      {/* Main content */}
      <VStack className="flex-1 justify-center space-y-6">
        <Box className="rounded-lg border border-gray-200 py-8 px-6">
          <Text className="text-center mb-8">
            Create and manage your time slots with ease
          </Text>

          {/* Navigation buttons */}
          <Link href="./createSlots" asChild>
            <Button size="lg" className="w-full mb-4">
              <ButtonText>Create Slots</ButtonText>
            </Button>
          </Link>

          <Link href={{ pathname: "./viewSlots" }} asChild>
            <Button size="lg" variant="outline" className="w-full">
              <ButtonText>View Slots</ButtonText>
            </Button>
          </Link>

          <Text className="text-xs text-center mt-6">
            Default timezone: UTC
          </Text>
        </Box>
      </VStack>

      {/* Footer */}
      <Box className="pt-8">
        <Text className="text-center text-xs">© 2025 Microwize</Text>
      </Box>
    </Box>
  );
}
