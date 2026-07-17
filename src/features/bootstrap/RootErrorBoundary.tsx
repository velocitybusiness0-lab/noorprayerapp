import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Surfaces JS crashes instead of a silent white splash. */
export class RootErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[RootErrorBoundary]", error, info.componentStack);
  }

  private retry = (): void => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Miraj hit an error</Text>
        <Text style={styles.message}>{this.state.error.message}</Text>
        <Pressable onPress={this.retry} style={styles.button}>
          <Text style={styles.buttonLabel}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F7F4EF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: "#4A4A4A",
    marginBottom: 24,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#6B9E88",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
