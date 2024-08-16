'use client';
import React from "react";
import { Flex } from '@chakra-ui/react';
import { Grid, Heading, Text, Input, Button, Spinner, Box } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import CTASection from '~/lib/components/samples/CTASection';
import Logo from '~/lib/components/samples/Logo';

const Home = () => {
  const [searchValue, setSearchValue] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Add your logic here to handle the search/analysis
    console.log('Analyzing:', searchValue)
    // Simulating an async operation
    await new Promise(resolve => setTimeout(resolve, 3000))
    setLoading(false)
    // Navigate to the results page after the analysis is complete
    router.push('/results');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "linear" }}
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
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
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
              Gain insights into your website's user experience with our comprehensive analysis tool. We grade websites on their design, navigation, and overall user experience, providing actionable recommendations to improve your website's performance.
            </Text>
          </motion.div>
          {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Flex as="form" mt={10} onSubmit={handleSubmit} gap={2}>
              <Input
                placeholder="Enter website URL"
                size="md"
                mr={2}
                value={searchValue}
                disabled={loading}
                onChange={(e) => setSearchValue(e.target.value)}
              />
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
              <Box display="flex" flexDirection={'column'} flexWrap={'wrap'} justifyContent="center" alignItems={'center'} mt={4}>
                <Spinner size="lg" />
                <Text fontSize="m" mt={4}>
                  Please wait, we are analyzing your website for UX, SEO and Perfromance recommendations...
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
