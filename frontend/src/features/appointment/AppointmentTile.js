import React from 'react';

const AppointmentTile = ({ event }) => {
  return (
    <div>
      {event.service.name} - {event.client.name}
    </div>
  );
};

export default AppointmentTile;
