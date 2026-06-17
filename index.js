import { settings } from "@vendetta/plugin";
import { patcher } from "@vendetta";
import { findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { TextInput, View, Text } from "react-native";

// Initialize plugin storage
const { storage } = settings.plugin("CustomUserBadges", {
    badgeName: "",
    badgeUrl: ""
});

// Find the module responsible for rendering badges
// Note: You may need to use the Developer Tools inspector to find the exact prop name
const BadgeModule = findByProps("Badge"); 

export default {
    onLoad: () => {
        this.unpatch = patcher.after("BadgeModule", "default", (args, res) => {
            if (storage.badgeUrl && storage.badgeName) {
                res.props.children.push(
                    React.createElement("img", {
                        src: storage.badgeUrl,
                        alt: storage.badgeName,
                        style: { width: 24, height: 24, marginLeft: 5 }
                    })
                );
            }
            return res;
        });
    },

    onUnload: () => {
        this.unpatch();
    },

    // UI for the plugin settings menu
    settings: () => (
        <View style={{ padding: 15 }}>
            <Text style={{ color: "white", marginBottom: 10, fontWeight: "bold" }}>Badge Settings</Text>

            <TextInput 
                placeholder="Badge Name (e.g., Supporter)"
                value={storage.badgeName}
                onChangeText={(v) => storage.badgeName = v}
                style={{ backgroundColor: "#2b2d31", color: "white", padding: 10, borderRadius: 5, marginBottom: 10 }}
            />

            <TextInput 
                placeholder="Image URL (Direct link to PNG/GIF)"
                value={storage.badgeUrl}
                onChangeText={(v) => storage.badgeUrl = v}
                style={{ backgroundColor: "#2b2d31", color: "white", padding: 10, borderRadius: 5 }}
            />

            <Text style={{ color: "#b5bac1", fontSize: 12, marginTop: 5 }}>
                Badges are visible only to you and others using this plugin.
            </Text>
        </View>
    )
};