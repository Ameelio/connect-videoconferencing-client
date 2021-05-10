import React, { useState, useEffect } from "react";
import FullCalendar, {
  EventClickArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarView.css";
import { VisitationToEventInput } from "src/utils";
import { Call } from "src/typings/Call";

interface Props {
  visitations: Call[];
}

const CalendarView: React.FC<Props> = ({ visitations }) => {
  const [events, setEvents] = useState<EventInput[]>([]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  useEffect(() => {
    setEvents(
      visitations.map((visitation) => VisitationToEventInput(visitation))
    );
  }, [visitations]);

  const renderEventContent = (
    eventContent: EventContentArg
  ): React.ReactFragment => {
    return (
      <>
        <b>{eventContent.timeText}</b>
        <i>{eventContent.event.title}</i>
      </>
    );
  };

  return (
    <div className="demo-app-main">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="timeGridWeek"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={false}
        businessHours={true}
        events={events} // alternatively, use the `events` setting to fetch from a feed
        eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
        // themeSystem="bootstrap"
        // eventsSet={(events: EventApi[]) => setCurrentEvents(events)} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
      />
    </div>
  );
};

export default CalendarView;
