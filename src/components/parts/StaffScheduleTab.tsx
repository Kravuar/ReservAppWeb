import React, { useState, useEffect } from "react";
import { DayOfWeek, LocalDate, TemporalAdjusters } from "@js-joda/core";
import { ReservationSlotDetailed } from "../../domain/Schedule";
import { Staff } from "../../domain/Staff";
import { Box, Tab, Tabs, IconButton, Pagination } from "@mui/material";
import ScheduleBody from "./ScheduleBody";
import { Refresh } from "@mui/icons-material";
import WeekSelector from "./WeekSelector";
import { Page } from "../../domain/Page";

export type ScheduleSupplier = (
  staffId: number,
  from: LocalDate,
  to: LocalDate
) => Promise<Map<LocalDate, ReservationSlotDetailed[]>>;
export type StaffSupplier = (page: number, pageSize: number) => Promise<Page<Staff>>;

export default function StaffScheduleTab({
  scheduleSupplier,
  staffSupplier,
}: {
  scheduleSupplier: ScheduleSupplier;
  staffSupplier: StaffSupplier;
}) {
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [staffList, setStaffList] = useState<Page<Staff> | null>(null);
  const [staffPage, setStaffPage] = useState(1);
  const [startOfWeek, setStartOfWeek] = useState<LocalDate>(
    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
  );
  const [endOfWeek, setEndOfWeek] = useState<LocalDate>(
    LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
  );
  const [schedule, setSchedule] = useState<
    Map<LocalDate, ReservationSlotDetailed[]>
  >(new Map());

  useEffect(() => {
    staffSupplier(staffPage, 10)
      .then(setStaffList)
      .catch((error) => alert(error));
  }, [staffPage, staffSupplier]);

  useEffect(() => {
    if (staffList && staffList.content.length > 0) setCurrentStaff(staffList?.content[0]);
  }, [staffList]);

  useEffect(() => {
    if (currentStaff)
      scheduleSupplier(currentStaff.id, startOfWeek, endOfWeek)
        .then(setSchedule)
        .catch((error) => alert(error));
  }, [currentStaff, startOfWeek, endOfWeek, scheduleSupplier]);

  function handleStaffChange(newStaffId: number) {
    const newStaff = staffList?.content.find((staff) => staff.id === newStaffId);
    if (newStaff) setCurrentStaff(newStaff);
  }

  function handleWeekChange(
    newStartOfWeek: LocalDate,
    newEndOfWeek: LocalDate
  ) {
    setStartOfWeek(newStartOfWeek);
    setEndOfWeek(newEndOfWeek);
  }

  function handleRefresh() {
    if (currentStaff)
      scheduleSupplier(currentStaff.id, startOfWeek, endOfWeek)
        .then(setSchedule)
        .catch((error) => alert(error));
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <WeekSelector date={startOfWeek} onChange={handleWeekChange} />
        <IconButton
          edge="end"
          aria-label="refresh"
          aria-haspopup="true"
          onClick={handleRefresh}
          color="inherit"
        >
          <Refresh />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Pagination
          count={staffList?.totalPages || 1}
          page={staffPage}
          onChange={(_, newPage) => setStaffPage(newPage)}
          sx={{ marginTop: 1 }}
          showFirstButton
          showLastButton
        />
        <Tabs
          sx={{
            width: "30%",
            borderRight: 1,
            borderColor: "divider",
          }}
          value={currentStaff?.id}
          onChange={(_, newStaffId) => handleStaffChange(newStaffId)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="staff tabs"
          orientation="vertical"
        >
          {staffList?.content.map((staff) => (
            <Tab
              label={staff.name}
              value={staff.id}
              key={staff.id}
              icon={staff.picture}
            />
          ))}
        </Tabs>
        <Box sx={{ width: "70%" }}>
          {currentStaff && (
            <ScheduleBody key={currentStaff.id} schedule={schedule} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
