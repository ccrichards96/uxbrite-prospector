'use client';

import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Input,
  Button,
  Spinner,
  Box,
  InputGroup, 
  InputLeftAddon,
  Select,
  Image,
  FormControl,
  FormErrorMessage,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';

import CTASection from '~/lib/components/samples/CTASection';
import Logo from '~/lib/components/samples/Logo';
import {useApp} from '../../contexts/app';
import Pusher from "pusher-js";

const Home = () => {

  React.useEffect(() => {
    const pusher = new Pusher("42cbe4cb2af6b19119ee", {
      cluster: "us2"
    });

    const channel = pusher.subscribe("progress-channel");
    channel.bind("update", (data:any) => {
      console.log("Received from SERVER ::", data)
      setCompletionPercentage(data.progress)
      setCompletionMsg(data.message)
    });
    return () => {
      pusher.unsubscribe("subscribe");
    };
  }, []);


  const {setDomainLink, setReportData, setReportDownloadLink} = useApp();

  const [isConnected, setIsConnected] = React.useState(false);
  const [transport, setTransport] = React.useState("N/A");

  const [completionPercentage, setCompletionPercentage] = React.useState(0);
  const [completionMsg, setCompletionMsg] = React.useState('');

  const [searchValue, setSearchValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isValidDomain(searchValue)) {
      setErrorMessage('Invalid domain. Please enter a valid domain name.');
      return;
    }
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

      const data = await response.json()

      if (data.error) {
        console.error('API error:', data.error)
        setLoading(false)
        // Handle the error, e.g., show an error message to the user
        // You might want to use a state variable or a toast notification here
      } else {
        // Process the API response as needed
        // For example, you might want to store the result in the app context
        setReportData(data.response)
        setReportDownloadLink(data?.response?.report_url)
        console.log(data?.response?.report_url)

        setLoading(false)
        // Navigate to the results page after the analysis is complete
        router.push('/results')
      }    
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
    setErrorMessage('');
  };

  const isValidDomain = (domain: string) => {
    const domainRegex = /^([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
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
  
        </motion.div>
        <Grid templateColumns="repeat(2, 1fr)" gap={6} textAlign="center" mb={1}>
          <GridItem>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Image
                  src="/logo-icon.png"
                  alt="UX Check"
                  height={50}
                  mb={4}
                />
                <Heading as="h1" size="lg" mb={2}>
                  Website UX Site Analysis
                </Heading>
                <Text fontSize="sm" mt={2}>
                Gain insights into your website's user experience with our
                comprehensive analysis tool. We grade websites on their design,
                navigation, and overall user experience, providing actionable
                recommendations to improve your website's performance.
              </Text>
              </Box>
            </motion.div>
          </GridItem>
          <GridItem display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
                  <Image
                  src="/webcatch.png"
                  alt="UX Check"
                  height={300}
                />
            </motion.div>
          </GridItem>
        </Grid>
        
        <Grid templateColumns="1fr" gap={0} m={0} w={"100%"}>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <FormControl isInvalid={!!errorMessage}>
        
                <Flex as="form" mt={0} onSubmit={handleSubmit} gap={0} display="flex" flexWrap="nowrap" flexDirection="row" alignItems="center">
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

                  <Button colorScheme="teal" type="submit" disabled={loading} borderRadius={10} mt={0}>
                    {loading ? <Spinner size="sm" /> : 'Scan'}
                  </Button>
                </Flex>
                <FormErrorMessage mb={2} p={0}>
                  {errorMessage}
                </FormErrorMessage>
              </FormControl>
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

                <CircularProgress value={completionPercentage} color='teal.500'>
                  <CircularProgressLabel>{completionPercentage}%</CircularProgressLabel>
                </CircularProgress>

                <Text fontSize="m" mt={1}>
                 {completionMsg}...
                </Text>

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
