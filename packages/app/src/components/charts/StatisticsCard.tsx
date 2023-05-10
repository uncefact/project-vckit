import ReactApexChart from 'react-apexcharts'
import { Box, Typography, Stack } from "@mui/material";
import { StatisticsCardProps } from 'interfaces/home';
import { useCustom, useApiUrl } from "@refinedev/core";
import React from 'react'

interface GetIdentifierCountResponse {
  count: number
}

export const StatisticsCard = ({title, resource}: StatisticsCardProps) => {
  const { data, isLoading } = useCustom<GetIdentifierCountResponse>({
    url: `${process.env.REACT_APP_VERAMO_URL}/${resource}`,
    method: 'post',
    config: {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_VERAMO_API_KEY}`
      }
    }
  })
  const count = data?.data
  return (
    <Box
      id='chart'
      flex={1}
      display='flex'
      bgcolor='#fcfcfc'
      justifyContent='space-between'
      // alignItems='center'
      pl={3.5}
      py={2}
      gap={2}
      borderRadius='15px'
      minHeight='110px'
      width='fit-content'
    >
      <Stack direction="column">
        <Typography fontSize={20} color='#808191'>{title}</Typography>
        {/* @ts-ignore */}
        <Typography fontSize={24} color='#11142d' fontWeight={700} mt={1}>{
          isLoading ? 'Loading...': count
          }</Typography>
      </Stack>
      
    </Box>
  )
}