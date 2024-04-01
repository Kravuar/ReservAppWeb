import { useState, useEffect } from "react";
import { LocalDate } from "@js-joda/core";
import { ReservationSlotDetailed } from "../../domain/Schedule";
import { Staff } from "../../domain/Staff";
import {
  Box,
  Tab,
  Tabs,
  Pagination,
  Avatar,
  Typography,
  Rating,
  Divider,
} from "@mui/material";
import ScheduleBody, { ReserveAction } from "./ScheduleBody";
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
  onReserve
}: {
  scheduleSupplier: ScheduleSupplier;
  staffSupplier: StaffSupplier;
  onReserve: ReserveAction;
}) {
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [staffList, setStaffList] = useState<Page<Staff> | null>(null);
  const [staffPage, setStaffPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<LocalDate>(LocalDate.now());
  const [schedule, setSchedule] = useState<
    Map<LocalDate, ReservationSlotDetailed[]>
  >(new Map());

  useEffect(() => {
    staffSupplier(staffPage, 10)
      .then(setStaffList);
  }, [staffPage, staffSupplier]);

  useEffect(() => {
    if (staffList && staffList.content.length > 0)
      setCurrentStaff(staffList?.content[0]);
  }, [staffList]);

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
    if (currentStaff)
      scheduleSupplier(currentStaff.id, newStartOfWeek, newEndOfWeek)
        .then(setSchedule)
        .catch(() => {})
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <WeekSelector onAccept={handleWeekChange} date={selectedDate} />
        <Divider orientation="vertical" flexItem />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxHeight: "30vw",
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
            value={currentStaff != null ? currentStaff.id : false}
            onChange={(_, newStaffId) => handleStaffChange(newStaffId)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="staff tabs"
            orientation="vertical"
            sx={{display: "flex", flexGrow: 1}}
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
        <Divider orientation="vertical" flexItem />
        {currentStaff && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "divider",
              borderRadius: 4,
              boxShadow: 4,
              p: 1,
              mx: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Rating value={currentStaff.rating} readOnly />
            <Typography variant="body1">
              {currentStaff.description}
            </Typography>
          </Box>
        )}
      </Box>
      <Box>
        {currentStaff && (
          <ScheduleBody key={currentStaff.id} schedule={schedule} onReserve={onReserve}/>
        )}
      </Box>
    </Box>
  );
}
