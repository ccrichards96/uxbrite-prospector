'use client';

import {
  Flex,
  Grid,
  Heading,
  Text,
  Input,
  Button,
  Spinner,
  Box,
  InputGroup, 
  InputLeftAddon,
  Select
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';

import CTASection from '~/lib/components/samples/CTASection';
import Logo from '~/lib/components/samples/Logo';
import {useApp} from '../../contexts/app';
import io from 'Socket.IO-client'
let socket

const Home = () => {
  const {setDomainLink, setReportData} = useApp();

  React.useEffect(() => {
    socketInitializer()
  }, [])

  const [completionPercentage, setCompletionPercentage] = React.useState(0);

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', msg => {
      setCompletionPercentage(msg)
    })
  }

  const [searchValue, setSearchValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add your logic here to handle the search/analysis
    const domain = `https://${searchValue.trim()}`;
    console.log('Analyzing:', domain);
    // Simulating an async operation


    try {
      const response = await fetch(`/api/hello?url=${domain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },      })

      if (!response.ok) {
        throw new Error('API request failed')
      }
      console.log('API:', response)

      const data = await response.json()
      console.log('API response:', data)

      // Process the API response as needed
      // For example, you might want to store the result in the app context
      setReportData(data.response)

      setLoading(false)
      // Navigate to the results page after the analysis is complete
      router.push('/results')
    } catch (error) {
      console.error('Error calling API:', error)
      setLoading(false)
      // Handle the error appropriately, e.g., show an error message to the user
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoading(false);
    // Navigate to the results page after the analysis is complete
    router.push('/results');
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setDomainLink(value)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'linear' }}
    >
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        gap={4}
        mb={8}
        w="full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
        >
          <Logo />
        </motion.div>
        <Grid textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Heading as="h1" size="lg">
              Website UX Site Analysis
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Text fontSize="sm" mt={5}>
              Gain insights into your website's user experience with our
              comprehensive analysis tool. We grade websites on their design,
              navigation, and overall user experience, providing actionable
              recommendations to improve your website's performance.
            </Text>
          </motion.div>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Flex as="form" mt={10} onSubmit={handleSubmit} gap={2}>
                <InputGroup>
                  <InputLeftAddon>
                    <Select variant='flushed' defaultValue="https://" size="sm">
                      <option value="https://">https://</option>
                    </Select>
                  </InputLeftAddon>
                  <Input
                    placeholder="Enter website URL"
                    size="md"
                    value={searchValue}
                    disabled={loading}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </InputGroup>
                <Button colorScheme="blue" type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Scan'}
                </Button>
              </Flex>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                display="flex"
                flexDirection="column"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                mt={4}
              >
                <Spinner size="lg" />
                <Text fontSize="m" mt={4}>
                  Please wait, we are analyzing your website for UX, SEO and
                  Perfromance recommendations...
                </Text>
              </Box>
            </motion.div>
          )}
        </Grid>
      </Flex>
    </motion.div>
  );
};

export default Home;
