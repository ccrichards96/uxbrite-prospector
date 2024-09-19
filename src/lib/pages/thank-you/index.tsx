'use client';
import { useContext } from 'react';
import {
  Flex,
  Grid,
  Heading,
  Text,
  Input,
  Button,
  Spinner,
  Box,
  Icon,
  Image,
  IconButton,
  VStack,
  Skeleton,
  FormControl,
  FormLabel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  MdEmail,
  MdPhotoCamera,
  MdFileDownload,
  MdLightbulb,
  MdDescription,
  MdBrush,
  MdSpeed,
  MdSecurity,
  MdSearch,
  MdCode,
  MdAccessibility,
  MdGrade,
  MdArrowBack,
  MdKeyboard,
  MdCompareArrows,
  MdLock,
  MdLink,
} from 'react-icons/md';
import {useApp} from '../../contexts/app';

const ThankYou = () => {
  const {reportDownloadLink, firstName} = useApp();

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleDownload = async (e: React.FormEvent) => {
    window.open(`${reportDownloadLink}`, '_blank');
  };

  const handleBack = () => {
    router.push('/');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeIn' }}
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
        <Grid textAlign="center">
          <Heading as="h1" size="lg">
            Thank You, {firstName || '-'}! 😊
          </Heading>
          <Text fontSize="sm" mt={5}>
            Click the link below to download your full report. One of our
            experts will be in touch with you about recommendations &
            implementation. <b>Happy Growing!</b>
          </Text>
          <Flex
            direction="row"
            gap={4}
            mt={5}
            textAlign="center"
            justifyContent="center"
          >
            <Button
              bgColor="teal.500"
              leftIcon={<Icon as={MdFileDownload} />}
              onClick={handleDownload}
              alignSelf="flex-start"
              mb={4}
            >
              Download Report (PDF)
            </Button>
            <Button
              leftIcon={<Icon as={MdArrowBack} />}
              onClick={handleBack}
              alignSelf="flex-start"
              mb={4}
            >
              Back to Home
            </Button>
          </Flex>

          <Box
            position="relative"
            height="400px"
            width="100%"
            mt={8}
            borderRadius="md"
            overflow="hidden"
          >
            <Image
              src="/webcatch.png"
              objectFit="cover"
              width="100%"
              height="100%"
              borderRadius={30}
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="linear-gradient(to top, teal, transparent)"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              color="white"
              borderRadius={30}
              padding={4}
            >
              <Heading as="h2" size="xl" mb={4}>
                Need Help Converting Traffic to Customers?
              </Heading>
              <Text fontSize="md" mb={6} textAlign="center">
                Sign up for our newsletter to receive exclusive tips and
                insights to help your business grow!
              </Text>
              <Button
                colorScheme="teal"
                size="lg"
                leftIcon={<Icon as={MdEmail} />}
                onClick={() => {
                  // Add newsletter signup logic here
                  console.log('Newsletter signup clicked');
                }}
              >
                Sign Up for Newsletter
              </Button>
            </Box>
          </Box>
        </Grid>
      </Flex>
    </motion.div>
  );
};

export default ThankYou;
