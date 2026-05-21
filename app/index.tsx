import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { Environment, Inquiry } from "react-native-persona";

const DEFAULT_TEMPLATE_ID = "itmpl_fphZBFQ4uPqpXNatQtWMbtjmDAzJ";

export default function Index() {
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
          width: "100%",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />
      <Button
        title="Start Inquiry"
        onPress={() => {
          Inquiry.fromTemplate(templateId)
            .environment(Environment.SANDBOX)
            .onComplete((inquiryId, status, fields) =>
              Alert.alert(
                "Complete",
                `Inquiry ${inquiryId} completed with status "${status}."`
              )
            )
            .onCanceled((inquiryId, sessionToken) =>
              Alert.alert("Canceled", `Inquiry ${inquiryId} was cancelled`)
            )
            .onError((error) => Alert.alert("Error", error.message))
            .build()
            .start();
        }}
      />
    </View>
  );
}
