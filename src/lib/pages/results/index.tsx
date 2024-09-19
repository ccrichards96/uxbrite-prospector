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
  Icon,
  Image,
  IconButton,
  VStack,
  Skeleton,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
  Wrap,
  WrapItem,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
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
  MdWarning,
  MdCheckCircle,
  MdCancel
} from 'react-icons/md';
import {useApp} from '../../contexts/app';


const sectionIcons = {
  beauty: { icon: MdPhotoCamera, color: "blue.500" },
  content: { icon: MdDescription, color: "green.500" },
  design: { icon: MdBrush, color: "purple.500" },
  performance: { icon: MdSpeed, color: "orange.500" },
  security: { icon: MdLock, color: "red.500" },
  seo: { icon: MdSearch, color: "yellow.500" },
  webStandards: { icon: MdCode, color: "pink.500" },
  accessibility: { icon: MdAccessibility, color: "teal.500" },
  overallGrade: { icon: MdGrade, color: "yellow.500" },
};

const Results = () => {
  const { reportData, domainLink, firstName, lastName, setEmail, setFirstName, setLastName, setPhoneNum } = useApp();


  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  // Add missing states and data
  const [yourSiteData] = React.useState({
    avgMonthlyVisitors: 10000,
    bounceRate: 45,
    conversionRate: 2.5,
    thumbnail: 'https://via.placeholder.com/300x200',
    url: 'https://example.com',
  });

  const [competitors] = React.useState([
    {
      name: 'Competitor A',
      avgMonthlyVisitors: 12000,
      bounceRate: 40,
      conversionRate: 3,
      thumbnail: 'https://via.placeholder.com/300x200',
      url: 'https://example.com',
    },
    {
      name: 'Competitor B',
      avgMonthlyVisitors: 9000,
      bounceRate: 50,
      conversionRate: 2,
      thumbnail: 'https://via.placeholder.com/300x200',
      url: 'https://example.com',
    },
    {
      name: 'Competitor C',
      avgMonthlyVisitors: 15000,
      bounceRate: 35,
      conversionRate: 3.5,
      thumbnail: 'https://via.placeholder.com/300x200',
      url: 'https://example.com',
    },
    {
      name: 'Competitor D',
      avgMonthlyVisitors: 8000,
      bounceRate: 55,
      conversionRate: 1.8,
      thumbnail: 'https://via.placeholder.com/300x200',
      url: 'https://example.com',
    },
    {
      name: 'Competitor E',
      avgMonthlyVisitors: 11000,
      bounceRate: 42,
      conversionRate: 2.7,
      thumbnail: 'https://via.placeholder.com/300x200',
      url: 'https://example.com',
    },
  ]);

  const recommendations = [
    {
      title: 'Improve Page Load Speed',
      description:
        'Optimize images and minify CSS/JS to enhance website performance.',
    },
    {
      title: 'Enhance SEO Strategy',
      description:
        'Implement targeted keywords and improve meta descriptions for better search engine visibility.',
    },
    {
      title: 'Upgrade Content Quality',
      description:
        'Create more engaging and relevant content to increase user engagement and reduce bounce rate.',
    },
    {
      title: 'Mobile Optimization',
      description:
        'Ensure your website is fully responsive and provides a seamless experience on all devices.',
    },
    {
      title: 'Implement SSL Certificate',
      description:
        'Secure your website with HTTPS to build trust and improve search engine rankings.',
    },
  ];

  // New state for form
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [formErrors, setFormErrors] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [formLoading, setFormLoading] = React.useState(false);

  // Handler for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user starts typing
    setFormErrors((prevState) => ({
      ...prevState,
      [name]: '',
    }));
  };

  // Form validation function
  const validateForm = () => {
    let isValid = true;
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    };

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = 'Phone number is invalid';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();

    setEmail(formData.email)
    setFirstName(formData.firstName);
    setLastName(formData.lastName);
    setPhoneNum(formData.phoneNumber);
    
    console.log('Form submitted:', formData);
    console.log('Form valid:', isValid);
    setFormLoading(true);

    if (isValid === false) {
      setFormLoading(false);
    }

    // if(validateForm()) return false
    try {
      // Add your form submission logic here
      // For example:
      // await submitForm()
      // router.push('/success')

      const response = await fetch(`/api/hello`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domainLink,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      console.log('API response:', data)

      if (data.error) {
        console.error('API error:', data.error)
        setFormLoading(false)
        // Handle the error, e.g., show an error message to the user
        // You might want to use a state variable or a toast notification here
      } else {
        // Process the API response as needed
        // For example, you might want to store the result in the app context
        setFormLoading(false)
        // Navigate to the results page after the analysis is complete
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/thank-you');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error state if needed
    } finally {
      setFormLoading(false);
    }
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
        <Button
          leftIcon={<Icon as={MdArrowBack} />}
          onClick={handleBack}
          alignSelf="flex-start"
          mb={4}
        >
          Back to Home
        </Button>

        <Grid templateColumns="repeat(2, 1fr)" gap={8} w="full" mb={8}>
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Scanned Domain
            </Heading>
            <Text fontSize="xl" fontWeight="bold">
              {domainLink || ''}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={1}>
              Report generated on {reportData.generatedDate}
            </Text>
          </Box>
          <Box borderWidth={1} borderRadius="md" overflow="hidden">
            <Image
              src={reportData.screenshot}
              alt="Website Thumbnail"
              objectFit="cover"
              w="full"
              h="200px"
            />
          </Box>
        </Grid>

        <Grid textAlign="center">
          <Heading as="h1" size="lg">
            Your Results
          </Heading>
          <Text fontSize="sm" mt={5}>
            When reviewing a website as the first digital experience for most
            brands, we start by considering the following criteria that is being
            evaluated.
          </Text>
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={4}
            mt={5}
            textAlign="center"
          >
            <Box>
              <Flex alignItems="center" justifyContent="center">
                <Icon as={MdPhotoCamera} mr={2} color="blue.500" />
                <Text fontSize="sm" fontWeight="bold" color="blue.500">
                  Beauty
                </Text>
              </Flex>
              <Text fontSize="sm">Visual appeal</Text>
            </Box>
            <Box>
              <Flex alignItems="center" justifyContent="center">
                <Icon as={MdDescription} mr={2} color="green.500" />
                <Text fontSize="sm" fontWeight="bold" color="green.500">
                  Content
                </Text>
              </Flex>
              <Text fontSize="sm">Copywriting, images, videos</Text>
            </Box>
            <Box>
              <Flex alignItems="center" justifyContent="center">
                <Icon as={MdBrush} mr={2} color="purple.500" />
                <Text fontSize="sm" fontWeight="bold" color="purple.500">
                  Design
                </Text>
              </Flex>
              <Text fontSize="sm">Layout, responsiveness</Text>
            </Box>
            <Box>
              <Flex alignItems="center" justifyContent="center">
                <Icon as={MdSpeed} mr={2} color="red.500" />
                <Text fontSize="sm" fontWeight="bold" color="red.500">
                  Performance
                </Text>
              </Flex>
              <Text fontSize="sm">Page load speed</Text>
            </Box>
            <Box>
              <Flex alignItems="center" justifyContent="center">
                <Icon as={MdSecurity} mr={2} color="teal.500" />
                <Text fontSize="sm" fontWeight="bold" color="teal.500">
                  Security
                </Text>
              </Flex>
              <Text fontSize="sm">HTTPS, SSL, TLS</Text>
            </Box>
            <Box>
              <Flex alignItems="center" justifyContent="center">
                <Icon as={MdSearch} mr={2} color="orange.500" />
                <Text fontSize="sm" fontWeight="bold" color="orange.500">
                  SEO
                </Text>
              </Flex>
              <Text fontSize="sm">Search engine optimization</Text>
            </Box>
            <Box>
              <Flex alignItems="center" justifyContent="center">
                <Icon as={MdCode} mr={2} color="pink.500" />
                <Text fontSize="sm" fontWeight="bold" color="pink.500">
                  Web Standards
                </Text>
              </Flex>
              <Text fontSize="sm">HTML, CSS, JS</Text>
            </Box>
            <Box>
              <Flex alignItems="center" justifyContent="center">
                <Icon as={MdAccessibility} mr={2} color="cyan.500" />
                <Text fontSize="sm" fontWeight="bold" color="cyan.500">
                  Accessibility
                </Text>
              </Flex>
              <Text fontSize="sm">Easy to access</Text>
            </Box>
          </Grid>
        </Grid>

        <Heading as="h1" size="lg" mt={10}>
          Your Website Grade
        </Heading>
        <Box>
          <Flex alignItems="center" justifyContent="center">
            <Icon as={MdAccessibility} mr={2} color="cyan.500" />
            <Text
              textDecoration="underline"
              fontSize="60px"
              fontWeight="bold"
              color="cyan.500"
            >
                {reportData.overallGrade} ({reportData.gradeScore.toFixed(1)})
            </Text>
          </Flex>
          <Text fontSize="xl">
            Overall, it could use some love and attention!
          </Text>
        </Box>

        <Accordion mt={10} width="100%">
        {Object.entries(reportData.sectionGrades).map(([key, value]:[string, any]) => (
          <AccordionItem key={key}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon 
                      as={sectionIcons[key as keyof typeof sectionIcons].icon} 
                      mr={2} 
                      color={sectionIcons[key as keyof typeof sectionIcons].color} 
                    />
                    <Text fontWeight="bold">{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  </Flex>
                </Box>
                <Text color={sectionIcons[key as keyof typeof sectionIcons].color} fontWeight="bold" mr={2}>
                  {value.grade} ({value.score.toFixed(1)})
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>{value.description}</Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
        </Accordion>

        <Heading as="h1" size="lg" mt={10}>
          Detailed Report
        </Heading>

        <Tabs mt={6} variant="enclosed">
          <TabList>
            <Tab>
              <Icon as={MdKeyboard} mr={2} />
              Relevant Keywords
            </Tab>
            <Tab>
              <Icon as={MdSearch} mr={2} />
              SEO
            </Tab>
            <Tab>
              <Icon as={MdSpeed} mr={2} />
              Performance
            </Tab>
            <Tab>
              <Icon as={MdDescription} mr={2} />
              Content
            </Tab>
            <Tab>
              <Icon as={MdCompareArrows} mr={2} />
              Site Comparison
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Flex>
                <Box flex="1">
                  <Text>Direct Search Keywords ({reportData.detailedReports.keywords.directSearch.length})</Text>
                  <Wrap spacing={2} mt={2}>
                    {reportData.detailedReports.keywords.directSearch.map((keyword, index) => (
                      <WrapItem key={index}>
                        <Badge>{keyword}</Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
                <Box width="auto" textAlign="right">
                  <Text>Optimal Range: 10-20 keywords</Text>
                  <Icon
                    as={reportData.detailedReports.keywords.directSearch.length >= 10 && reportData.detailedReports.keywords.directSearch.length <= 20 ? MdCheckCircle : (reportData.detailedReports.keywords.directSearch.length < 10 ? MdWarning : MdCancel)}
                    color={reportData.detailedReports.keywords.directSearch.length >= 10 && reportData.detailedReports.keywords.directSearch.length <= 20 ? "green.500" : (reportData.detailedReports.keywords.directSearch.length < 10 ? "yellow.500" : "red.500")}
                  />
                </Box>
              </Flex>
              <Flex mt={4}>
                <Box flex="1">
                  <Text>Contextual Keywords ({reportData.detailedReports.keywords.contextual.length})</Text>
                  <Wrap spacing={2} mt={2}>
                    {reportData.detailedReports.keywords.contextual.map((keyword, index) => (
                      <WrapItem key={index}>
                        <Badge>{keyword}</Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
                <Box width="auto" textAlign="right">
                  <Text>Optimal Range: 15-30 keywords</Text>
                  <Icon
                    as={reportData.detailedReports.keywords.contextual.length >= 15 && reportData.detailedReports.keywords.contextual.length <= 30 ? MdCheckCircle : (reportData.detailedReports.keywords.contextual.length < 15 ? MdWarning : MdCancel)}
                    color={reportData.detailedReports.keywords.contextual.length >= 15 && reportData.detailedReports.keywords.contextual.length <= 30 ? "green.500" : (reportData.detailedReports.keywords.contextual.length < 15 ? "yellow.500" : "red.500")}
                  />
                </Box>
              </Flex>
            </TabPanel>
            <TabPanel>
              <Box>
                <Flex direction="column" gap={4}>
                  <Flex>
                    <Box flex="1">
                      <Text fontWeight="bold">Robots.txt</Text>
                      <Text>{reportData.detailedReports.seo.robotsTxt}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text>Optimal: Present and properly configured</Text>
                      <Icon as={MdCheckCircle} color={reportData.detailedReports.seo.robotsTxt ? "green.500" : "red.500"} />
                    </Box>
                  </Flex>
                  <Flex>
                    <Box flex="1">
                      <Text fontWeight="bold">Indexable</Text>
                      <Text>{reportData.detailedReports.seo.indexable ? 'Yes' : 'No'}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text>Optimal: Yes</Text>
                      <Icon as={reportData.detailedReports.seo.indexable ? MdCheckCircle : MdCancel} color={reportData.detailedReports.seo.indexable ? "green.500" : "red.500"} />
                    </Box>
                  </Flex>
                  <Flex>
                    <Box flex="1">
                      <Text fontWeight="bold">Redirects</Text>
                      <Text>{reportData.detailedReports.seo.redirects.join(', ')}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text>Optimal: Minimal (0-2)</Text>
                      <Icon as={reportData.detailedReports.seo.redirects.length <= 2 ? MdCheckCircle : (reportData.detailedReports.seo.redirects.length <= 5 ? MdWarning : MdCancel)} color={reportData.detailedReports.seo.redirects.length <= 2 ? "green.500" : (reportData.detailedReports.seo.redirects.length <= 5 ? "yellow.500" : "red.500")} />
                    </Box>
                  </Flex>
                  <Flex>
                    <Box flex="1">
                      <Text fontWeight="bold">Meta</Text>
                      <Text>Title: {reportData.detailedReports.seo.meta.title}</Text>
                      <Text>Description: {reportData.detailedReports.seo.meta.description}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text>Optimal: Title (50-60 chars), Description (150-160 chars)</Text>
                      <Icon as={
                        (reportData.detailedReports.seo.meta.title.length >= 50 && reportData.detailedReports.seo.meta.title.length <= 60 &&
                        reportData.detailedReports.seo.meta.description.length >= 150 && reportData.detailedReports.seo.meta.description.length <= 160) 
                        ? MdCheckCircle 
                        : ((reportData.detailedReports.seo.meta.title.length >= 40 && reportData.detailedReports.seo.meta.title.length <= 70 &&
                        reportData.detailedReports.seo.meta.description.length >= 140 && reportData.detailedReports.seo.meta.description.length <= 170)
                        ? MdWarning
                        : MdCancel)
                      } 
                      color={
                        (reportData.detailedReports.seo.meta.title.length >= 50 && reportData.detailedReports.seo.meta.title.length <= 60 &&
                        reportData.detailedReports.seo.meta.description.length >= 150 && reportData.detailedReports.seo.meta.description.length <= 160) 
                        ? "green.500" 
                        : ((reportData.detailedReports.seo.meta.title.length >= 40 && reportData.detailedReports.seo.meta.title.length <= 70 &&
                        reportData.detailedReports.seo.meta.description.length >= 140 && reportData.detailedReports.seo.meta.description.length <= 170)
                        ? "yellow.500"
                        : "red.500")
                      } />
                    </Box>
                  </Flex>
                  <Flex>
                    <Box flex="1">
                      <Text fontWeight="bold">Search Engine Ranking</Text>
                      <Text>{reportData.detailedReports.seo.searchEngineRanking}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text>Optimal: Top 10</Text>
                      <Icon as={
                        reportData.detailedReports.seo.searchEngineRanking <= 10 
                        ? MdCheckCircle 
                        : (reportData.detailedReports.seo.searchEngineRanking <= 50 
                          ? MdWarning 
                          : MdCancel)
                      } 
                      color={
                        reportData.detailedReports.seo.searchEngineRanking <= 10 
                        ? "green.500" 
                        : (reportData.detailedReports.seo.searchEngineRanking <= 50 
                          ? "yellow.500" 
                          : "red.500")
                      } />
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <Flex direction="column" gap={4}>
                  <Flex justify="space-between" align="center">
                    <Box flex="1">
                      <Text fontWeight="bold">Cookies</Text>
                      <Text>{reportData.detailedReports.performance.cookies}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text>Optimal: 1-5</Text>
                      <Icon 
                        as={reportData.detailedReports.performance.cookies <= 5 ? MdCheckCircle : reportData.detailedReports.performance.cookies <= 10 ? MdWarning : MdCancel} 
                        color={reportData.detailedReports.performance.cookies <= 5 ? "green.500" : reportData.detailedReports.performance.cookies <= 10 ? "yellow.500" : "red.500"}
                      />
                    </Box>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Box flex="1">
                      <Text fontWeight="bold">Javascript Files</Text>
                      <Text>{reportData.detailedReports.performance.javascriptFiles}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text>Optimal: 1-10</Text>
                      <Icon 
                        as={reportData.detailedReports.performance.javascriptFiles <= 10 ? MdCheckCircle : reportData.detailedReports.performance.javascriptFiles <= 20 ? MdWarning : MdCancel} 
                        color={reportData.detailedReports.performance.javascriptFiles <= 10 ? "green.500" : reportData.detailedReports.performance.javascriptFiles <= 20 ? "yellow.500" : "red.500"}
                      />
                    </Box>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Box flex="1">
                      <Text fontWeight="bold">CSS Files</Text>
                      <Text>{reportData.detailedReports.performance.cssFiles}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text>Optimal: 1-5</Text>
                      <Icon 
                        as={reportData.detailedReports.performance.cssFiles <= 5 ? MdCheckCircle : reportData.detailedReports.performance.cssFiles <= 10 ? MdWarning : MdCancel} 
                        color={reportData.detailedReports.performance.cssFiles <= 5 ? "green.500" : reportData.detailedReports.performance.cssFiles <= 10 ? "yellow.500" : "red.500"}
                      />
                    </Box>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Box flex="1">
                      <Text fontWeight="bold">Page Size</Text>
                      <Text>{reportData.detailedReports.performance.pageSize}</Text>
                    </Box>
                    <Box textAlign="right">
                      <Text>Optimal: less than 1MB</Text>
                      <Icon 
                        as={reportData.detailedReports.performance.pageSize < 1000000 ? MdCheckCircle : reportData.detailedReports.performance.pageSize < 2000000 ? MdWarning : MdCancel} 
                        color={reportData.detailedReports.performance.pageSize < 1000000 ? "green.500" : reportData.detailedReports.performance.pageSize < 2000000 ? "yellow.500" : "red.500"}
                      />
                    </Box>
                  </Flex>
                </Flex>
              </Box>
              <Text>Performance content goes here.</Text>
            </TabPanel>
            <TabPanel>
              <Box>
              <Flex direction="column" gap={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Text fontWeight="bold">Grammatical Errors</Text>
                      <Text>{reportData.detailedReports.content.grammaticalErrors}</Text>
                  </Box>
                  <Flex alignItems="center">
                      <Text mr={2}>0-2</Text>
                      {reportData.detailedReports.content.grammaticalErrors <= 2 ? (
                          <Icon as={MdCheckCircle} color="green.500" />
                      ) : reportData.detailedReports.content.grammaticalErrors <= 5 ? (
                          <Icon as={MdWarning} color="yellow.500" />
                      ) : (
                          <Icon as={MdCancel} color="red.500" />
                      )}
                  </Flex>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Text fontWeight="bold"># of Words</Text>
                      <Text>{reportData.detailedReports.content.wordCount}</Text>
                  </Box>
                  <Flex alignItems="center">
                      <Text mr={2}>300-1000</Text>
                      {reportData.detailedReports.content.wordCount >= 300 && reportData.detailedReports.content.wordCount <= 1000 ? (
                          <Icon as={MdCheckCircle} color="green.500" />
                      ) : reportData.detailedReports.content.wordCount > 1000 ? (
                          <Icon as={MdWarning} color="yellow.500" />
                      ) : (
                          <Icon as={MdCancel} color="red.500" />
                      )}
                  </Flex>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Text fontWeight="bold">Unique Words</Text>
                      <Text>{reportData.detailedReports.content.uniqueWords}</Text>
                  </Box>
                  <Flex alignItems="center">
                      <Text mr={2}>100-300</Text>
                      {reportData.detailedReports.content.uniqueWords >= 100 && reportData.detailedReports.content.uniqueWords <= 300 ? (
                          <Icon as={MdCheckCircle} color="green.500" />
                      ) : reportData.detailedReports.content.uniqueWords > 300 ? (
                          <Icon as={MdWarning} color="yellow.500" />
                      ) : (
                          <Icon as={MdCancel} color="red.500" />
                      )}
                  </Flex>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Text fontWeight="bold">Images</Text>
                      <Text>{reportData.detailedReports.content.images}</Text>
                  </Box>
                  <Flex alignItems="center">
                      <Text mr={2}>1-5</Text>
                      {reportData.detailedReports.content.images >= 1 && reportData.detailedReports.content.images <= 5 ? (
                          <Icon as={MdCheckCircle} color="green.500" />
                      ) : reportData.detailedReports.content.images > 5 ? (
                          <Icon as={MdWarning} color="yellow.500" />
                      ) : (
                          <Icon as={MdCancel} color="red.500" />
                      )}
                  </Flex>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Text fontWeight="bold">Videos</Text>
                      <Text>{reportData.detailedReports.content.videos}</Text>
                  </Box>
                  <Flex alignItems="center">
                      <Text mr={2}>0-2</Text>
                      {reportData.detailedReports.content.videos <= 2 ? (
                          <Icon as={MdCheckCircle} color="green.500" />
                      ) : reportData.detailedReports.content.videos <= 4 ? (
                          <Icon as={MdWarning} color="yellow.500" />
                      ) : (
                          <Icon as={MdCancel} color="red.500" />
                      )}
                  </Flex>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Text fontWeight="bold">Backlinks</Text>
                      <Text>{reportData.detailedReports.content.backlinks}</Text>
                  </Box>
                  <Flex alignItems="center">
                      <Text mr={2}>5-20</Text>
                      {reportData.detailedReports.content.backlinks >= 5 && reportData.detailedReports.content.backlinks <= 20 ? (
                          <Icon as={MdCheckCircle} color="green.500" />
                      ) : reportData.detailedReports.content.backlinks > 20 ? (
                          <Icon as={MdWarning} color="yellow.500" />
                      ) : (
                          <Icon as={MdCancel} color="red.500" />
                      )}
                  </Flex>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                      <Text fontWeight="bold">Language</Text>
                      <Text>{reportData.detailedReports.content.language}</Text>
                  </Box>
                  <Flex alignItems="center">
                      <Text mr={2}>Detected</Text>
                      {reportData.detailedReports.content.language ? (
                          <Icon as={MdCheckCircle} color="green.500" />
                      ) : (
                          <Icon as={MdCancel} color="red.500" />
                      )}
                  </Flex>
              </Box>
              </Flex>
            </Box>            </TabPanel>
            <TabPanel>
              <Box>
                <Text fontWeight="bold" mb={4}>
                  Site Comparison
                </Text>
                <Text mb={4}>
                  Here is a comparison of the top five similar websites to your
                  brand and how your site competes.
                </Text>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Thumbnail</Th>
                      <Th>Website</Th>
                      <Th>Avg. Monthly Visitors</Th>
                      <Th>Bounce Rate</Th>
                      <Th>Avg Time On Site</Th>
                      <Th>Link</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr backgroundColor="teal.600">
                      <Td>
                        <Image src={reportData.screenshot} width="300px" />
                      </Td>
                      <Td>Your Site</Td>
                      <Td>
                        {reportData.siteData.avgMonthlyVisitors.toLocaleString()}
                      </Td>
                      <Td>{reportData.siteData.bounceRate}%</Td>
                      <Td>{reportData.siteData.conversionRate}%</Td>
                      <Td>
                        <IconButton
                          aria-label="Visit site"
                          onClick={() =>
                            window.open(domainLink, '_blank')
                          }
                        >
                          <Icon as={MdLink} />
                        </IconButton>
                      </Td>
                    </Tr>
                    {reportData.competitors.map((competitor, index) => (
                      <Tr key={index}>
                        <Td>
                          <Image src={competitor.thumbnail} width="300px" />
                        </Td>
                        <Td>{competitor.name}</Td>
                        <Td>
                          {competitor.avgMonthlyVisitors.toLocaleString()}
                        </Td>
                        <Td>{competitor.bounceRate.toFixed(2)}%</Td>
                        <Td>{competitor.conversionRate.toFixed(0)}</Td>
                        <Td>
                          <IconButton
                            aria-label="Visit site"
                            onClick={() =>
                              window.open(competitor.url, '_blank')
                            }
                          >
                            <Icon as={MdLink} />
                          </IconButton>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Text mt={4}>
                  *Conversion rates are based on industry averages
                </Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Heading as="h1" size="lg" mt={10}>
          Recommendations
        </Heading>
        <Box>
          <Text mb={4}>
            Here are the top recommendations to improve your online presence:
          </Text>
          <VStack spacing={4} align="stretch" position="relative">
            {reportData.recommendations.slice(0, 6).map((recommendation, index) => (
              <Box key={index} p={4} borderWidth={1} borderRadius="md">
                <Flex alignItems="center">
                  <Icon as={MdLightbulb} color="yellow.400" mr={2} />
                  <Text fontWeight="bold">{recommendation.title}</Text>
                </Flex>
                {index < 2 ? (
                  <Text mt={2}>{recommendation.description}</Text>
                ) : (
                  <Text mt={2}>
                    Download the full report to get all recommendations.
                  </Text>
                )}
              </Box>
            ))}
            <Box
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              height="50%"
              borderRadius="10px"
              bgGradient="linear(to-t, teal, transparent)"
              pointerEvents="none"
            />
          </VStack>
          <Box mt={10} textAlign="center">
            <Icon as={MdLock} fontSize="3xl" color="gray.500" />
            <Text mt={2} fontWeight="bold">
              Unlock more recommendations in the full report
            </Text>
          </Box>
        </Box>

        <Box
          mt={8}
          p={6}
          borderRadius="lg"
          boxShadow="xl"
          bg="teal.600"
          color="white"
        >
          <Flex alignItems="center" justifyContent="space-between">
            <Box flex="1">
              <Heading as="h3" size="lg" mb={4}>
                Want the full report?
              </Heading>
              <Text fontSize="md" mb={4}>
                Download our 10+ page comprehensive report for in-depth details
                and actionable recommendations to boost your online presence.
              </Text>
              <form onSubmit={handleFormSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl isInvalid={!!formErrors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                    <FormErrorMessage>{formErrors.firstName}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!formErrors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                    <FormErrorMessage>{formErrors.lastName}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!formErrors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Enter your email"
                    />
                    <FormErrorMessage>{formErrors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!formErrors.phoneNumber}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      type="tel"
                      placeholder="Enter your phone number"
                    />
                    <FormErrorMessage>
                      {formErrors.phoneNumber}
                    </FormErrorMessage>
                  </FormControl>
                  <Button
                    type="submit"
                    rightIcon={
                      !formLoading ? <Icon as={MdFileDownload} /> : <Box />
                    }
                    variant="outline"
                    size="lg"
                    disabled={formLoading}
                  >
                    {formLoading ? <Spinner size="sm" /> : 'Get Full Report'}
                  </Button>
                </VStack>
              </form>
            </Box>
            <Box flex="1" ml={8}>
              <Image
                src="/report.png"
                alt="Report Preview"
                borderRadius="md"
                boxShadow="lg"
              />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </motion.div>
  );
};

export default Results;
