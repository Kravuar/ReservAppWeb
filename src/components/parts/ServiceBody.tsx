import { ServiceDetailed } from "../../domain/Service";
import ServiceCard from "./ServiceCard";
import { Box, Tab, Tabs } from "@mui/material";
import StaffScheduleTab, {
  ScheduleSupplier as StaffScheduleSupplier,
  StaffSupplier
} from "./StaffScheduleTab";
import ServiceScheduleTab, {
  ScheduleSupplier as ServiceScheduleSupplier,
} from "./ServiceScheduleTab";
import { ReserveAction } from "./ScheduleBody";
import { useState } from "react";

export default function ServiceBody({
  service,
  serviceScheduleSupplier,
  staffScheduleSupplier,
  staffSupplier,
  onReserve
}: {
  service: ServiceDetailed;
  serviceScheduleSupplier: ServiceScheduleSupplier;
  staffScheduleSupplier: StaffScheduleSupplier;
  staffSupplier: StaffSupplier;
  onReserve: ReserveAction;
}) {
  const [tab, setTab] = useState(0);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <ServiceCard service={service}/>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Tabs
          variant="scrollable"
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ tabSize: 50 }}
        >
          <Tab label="Расписание" />
          <Tab label="Сотрудники" />
          <Tab label="Отзывы" />
        </Tabs>
        <Box sx={{ padding: 3 }}>
          {tab === 0 && (
            <ServiceScheduleTab onReserve={onReserve} scheduleSupplier={serviceScheduleSupplier} />
          )}
          {tab === 1 && (
            <StaffScheduleTab
              onReserve={onReserve}
              scheduleSupplier={staffScheduleSupplier}
              staffSupplier={staffSupplier}
            />
          )}
          {/* TODO: Reviews tab */}
          {tab === 2 && <div>Тут должны быть отзывы</div>}
        </Box>
      </Box>
    </Box>
  );
}
