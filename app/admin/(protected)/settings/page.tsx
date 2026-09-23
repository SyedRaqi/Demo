"use client";
import { AdminResource } from "@/components/admin-resource";
const fields = [{ key: "setting_key", label: "Setting key", required: true }, { key: "value_en", label: "Value EN", type: "textarea" as const }, { key: "value_ur", label: "Value UR", type: "textarea" as const, rtl: true }];
export default function SettingsPage() { return <AdminResource endpoint="/api/admin/settings" eyebrow="SITE / SETTINGS" title="Site settings" description="Keep approved organization details in one place for future public pages." emptyTitle="No settings saved." emptyText="Add official contact, social and organization details here." fields={fields} defaults={{ setting_key: "", value_en: "", value_ur: "" }} summary={(record) => String(record.setting_key)} />; }
