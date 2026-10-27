import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Button,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Environment, Inquiry } from "react-native-persona";

const DEFAULT_TEMPLATE_ID = "itmpl_fphZBFQ4uPqpXNatQtWMbtjmDAzJ";

type PersonaEnvOption = {
  label: string;
  envId: string;
  isSimulated: boolean;
};

const ENVIRONMENTS: PersonaEnvOption[] = [
  {
    label: "Development",
    envId: "env_LNdjdZCjS4T8hPvPyxXd1YGEnD6D",
    isSimulated: false,
  },
  {
    label: "Development Sandbox",
    envId: "env_6c7RTtNLqiTRXrehh27NDqzrCgLH",
    isSimulated: true,
  },
  {
    label: "Staging",
    envId: "env_LrxeQ2vZ1R7QcjRcSbFuRRn4D6mh",
    isSimulated: false,
  },
  {
    label: "Staging Sandbox",
    envId: "env_SJ5YMaWS191cTWMdXENc1EJ2FAMj",
    isSimulated: true,
  },
  {
    label: "Production",
    envId: "env_uofvkLPsKiUUec7T3kGETC7vJQcY",
    isSimulated: false,
  },
  {
    label: "Sandbox",
    envId: "env_eBrzBhk4L2rtmAE3j3bwsvSjvCYa",
    isSimulated: true,
  },
];

const LIVE_COLOR = "#5b5bd6";
const SIMULATED_COLOR = "#f5a524";

export default function Index() {
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [selectedEnv, setSelectedEnv] = useState<PersonaEnvOption>(
    ENVIRONMENTS[1], // default to Development Sandbox (safest)
  );
  const [cameraStatus, setCameraStatus] = useState<string | null>(null);
  const [testPhotoUri, setTestPhotoUri] = useState<string | null>(null);

  const testCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    setCameraStatus(permission.status);

    if (!permission.granted) {
      Alert.alert(
        "Camera access denied",
        "Enable camera access for this app in Settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
      if (!result.canceled) {
        setTestPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        "Camera error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const startInquiry = () => {
    const host = selectedEnv.isSimulated
      ? Environment.SANDBOX
      : Environment.PRODUCTION;

    if (!selectedEnv.isSimulated) {
      Alert.alert(
        "Confirm Live Inquiry",
        `${selectedEnv.label} performs real KYC and is billed. Continue?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Start",
            style: "destructive",
            onPress: () => runInquiry(host),
          },
        ],
      );
      return;
    }

    runInquiry(host);
  };

  const runInquiry = (host: (typeof Environment)[keyof typeof Environment]) => {
    Inquiry.fromTemplate(templateId)
      .environment(host)
      .environmentId(selectedEnv.envId)
      .onComplete((inquiryId, status) =>
        Alert.alert(
          "Complete",
          `Inquiry ${inquiryId} completed with status "${status}."`,
        ),
      )
      .onCanceled((inquiryId) =>
        Alert.alert("Canceled", `Inquiry ${inquiryId} was cancelled`),
      )
      .onError((error) => Alert.alert("Error", error.message))
      .build()
      .start();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 16,
        gap: 16,
      }}
    >
      <TextInput
        value={templateId}
        onChangeText={setTemplateId}
        placeholder="Persona template ID"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />

      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: "600", fontSize: 14 }}>Environment</Text>
        {ENVIRONMENTS.map((env) => {
          const isSelected = env.envId === selectedEnv.envId;
          const accent = env.isSimulated ? SIMULATED_COLOR : LIVE_COLOR;

          return (
            <TouchableOpacity
              key={env.envId}
              onPress={() => setSelectedEnv(env)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? accent : "#ddd",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: isSelected ? `${accent}15` : "#fff",
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: accent,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600" }}>{env.label}</Text>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  {env.isSimulated ? "Simulated Data" : "Live"} · {env.envId}
                </Text>
              </View>
              {isSelected && (
                <Text style={{ color: accent, fontWeight: "700" }}>✓</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        title={`Start Inquiry (${selectedEnv.label})`}
        onPress={startInquiry}
      />

      <Button title="Test Camera" onPress={testCamera} />
      {cameraStatus && (
        <Text style={{ textAlign: "center", color: "#666" }}>
          Camera permission: {cameraStatus}
        </Text>
      )}
      {testPhotoUri && (
        <Image
          source={{ uri: testPhotoUri }}
          style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 8 }}
          contentFit="cover"
        />
      )}
    </ScrollView>
  );
}
