import { Alert, Button, View } from "react-native";
import { Environment, Inquiry } from "react-native-persona";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Start Inquiry"
        onPress={() => {
          Inquiry.fromTemplate("itmpl_JvnNSNLNW5vBdxQuPqSVFMkiRKzX")
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
