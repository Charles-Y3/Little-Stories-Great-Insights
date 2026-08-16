import { useCallback, useState } from "react";
import { autoSaveIfEnabled, exportSmart } from "../utils/folderBackup";
import { shouldShowBackupReminder, snoozeBackupReminder } from "../utils/backupReminder";

// Call triggerAfterChange() right after an insight write. If it was silently
// auto-saved to a folder, nothing surfaces. Otherwise — the common case on
// Firefox/Safari/iOS, where folder auto-save doesn't exist — it shows an
// export nudge, gated by the same 7-day/snooze rule as the Settings
// reminder so writing several insights in a row doesn't spam the user.
export default function useBackupNudge() {
  const [visible, setVisible] = useState(false);

  const triggerAfterChange = useCallback(() => {
    void autoSaveIfEnabled().then((saved) => {
      if (!saved && shouldShowBackupReminder(true)) setVisible(true);
    });
  }, []);

  const exportNow = useCallback(() => {
    void exportSmart().then((result) => {
      // Leave the toast up if the folder picker was cancelled, so the user
      // can try again or dismiss explicitly, instead of it vanishing with
      // nothing having actually been backed up.
      if (result.mode !== "cancelled") setVisible(false);
    });
  }, []);

  const dismiss = useCallback(() => {
    snoozeBackupReminder();
    setVisible(false);
  }, []);

  return { showNudge: visible, triggerAfterChange, exportNow, dismiss };
}
