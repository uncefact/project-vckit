import React from 'react'
import { Typography, Box, Stack } from "@mui/material";
import { StatisticsCard } from 'components';

import { resourceMap } from 'vermoQueryMapper';

export const Home = () => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color={'#11142D'}>Dashboard</Typography>
      <Box mt='20px' display='flex' gap={4} flexWrap='wrap' className={`.shepherd-tour-dashboard-page`}>
        <StatisticsCard
          title="Known Identifiers"
          resource={resourceMap['identifiersCount']}
        />
        <StatisticsCard
          title="Credentials"
          resource={resourceMap['credentialsCount']}
        />
      </Box>
      <Stack
                mt="25px"
                width="100%"
                direction={{ xs: "column", lg: "row" }}
                gap={4}
            >
            </Stack>
    </Box>
  )
}

