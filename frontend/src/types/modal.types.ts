export type ModalMode = "add" | "edit";
export type EntryType = "income" | "expense" | "goal" | "contribution";
export type ModalState = null | { mode: ModalMode; type: EntryType; data?: any };
