import { LocalDate } from "@js-joda/core";
import { ReservationSlotDetailed } from "../../domain/Schedule";
import { Box, Typography } from "@mui/material";
import ScheduleCard from "./ScheduleCard";

export default function ScheduleBody({
    schedule
}: {
    schedule: Map<LocalDate, ReservationSlotDetailed[]>
}) {
    return (
        <Box overflow="auto">
            {Array.from(schedule.entries()).map(([date, slots], index) => (
                <Box key={index} my={2}>
                    <Typography variant="h6" gutterBottom>
                        {date.toString()}
                    </Typography>
                    <ScheduleCard slots={slots} />
                </Box>
            ))}
        </Box>
    );
}