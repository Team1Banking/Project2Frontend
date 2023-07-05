import React, { useState } from 'react';
import { Box } from '@mui/material';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');

  return (
    <>
      <Box>SideBar</Box>
    </>
  );
}
