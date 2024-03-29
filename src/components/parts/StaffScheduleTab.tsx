import React, { useState, useEffect } from "react";
import { DayOfWeek, LocalDate, TemporalAdjusters } from "@js-joda/core";
import { ReservationSlotDetailed } from "../../domain/Schedule";
import { Staff } from "../../domain/Staff";
import {
  Box,
  Tab,
  Tabs,
  IconButton,
  Pagination,
  Avatar,
  Typography,
} from "@mui/material";
import ScheduleBody from "./ScheduleBody";
import { Refresh } from "@mui/icons-material";
import WeekSelector from "./WeekSelector";
import { Page } from "../../domain/Page";

export type ScheduleSupplier = (
  staffId: number,
  from: LocalDate,
  to: LocalDate
) => Promise<Map<LocalDate, ReservationSlotDetailed[]>>;
export type StaffSupplier = (
  page: number,
  pageSize: number
) => Promise<Page<Staff>>;

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
  const [selectedDate, setSelectedDate] = useState<LocalDate>(LocalDate.now());
  const [startOfWeek, setStartOfWeek] = useState<LocalDate>(
    selectedDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
  );
  const [endOfWeek, setEndOfWeek] = useState<LocalDate>(
    selectedDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
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
    if (staffList && staffList.content.length > 0)
      setCurrentStaff(staffList?.content[0]);
  }, [staffList]);

  useEffect(() => {
    if (currentStaff)
      scheduleSupplier(currentStaff.id, startOfWeek, endOfWeek)
        .then(setSchedule)
        .catch((error) => alert(error));
  }, [currentStaff, startOfWeek, endOfWeek, scheduleSupplier]);

  function handleStaffChange(newStaffId: number) {
    const newStaff = staffList?.content.find(
      (staff) => staff.id === newStaffId
    );
    if (newStaff) setCurrentStaff(newStaff);
  }

  function handleWeekChange(
    newSelectedDate: LocalDate,
    newStartOfWeek: LocalDate,
    newEndOfWeek: LocalDate
  ) {
    setSelectedDate(newSelectedDate);
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
      <Box sx={{ display: "flex", flexDirection: "row"}}>
        <WeekSelector
          onAccept={handleRefresh}
          date={selectedDate}
          onChange={handleWeekChange}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxHeight: '30vw'
          }}
        >
          <Typography variant="h6" component="div">
            Сотрудники
          </Typography>
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
              borderRight: 1,
              borderColor: "divider",
            }}
            value={currentStaff != null ? currentStaff.id : false}
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
                icon={<Avatar src={staff.picture} />}
              />
            ))}
          </Tabs>
        </Box>
      </Box>
      <Box>
        {currentStaff && (
          <ScheduleBody key={currentStaff.id} schedule={schedule} />
        )}
      </Box>
    </Box>
  );
}
