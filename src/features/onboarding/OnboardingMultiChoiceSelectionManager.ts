/**
 * Resolves the next selected option ids for multi-choice onboarding steps.
 * Single-select replaces the prior choice (radio); multi toggles membership.
 */
export class OnboardingMultiChoiceSelectionManager {
  static nextSelection(
    selectedIds: string[],
    optionId: string,
    allowMultiple: boolean
  ): string[] {
    if (!allowMultiple) {
      return selectedIds.length === 1 && selectedIds[0] === optionId
        ? []
        : [optionId];
    }
    if (selectedIds.includes(optionId)) {
      return selectedIds.filter((id) => id !== optionId);
    }
    return [...selectedIds, optionId];
  }
}
