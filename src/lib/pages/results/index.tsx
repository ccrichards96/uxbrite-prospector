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
} from 'react-icons/md';

const Results = () => {
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
      await new Promise((resolve) => setTimeout(resolve, 6000));
      router.push('/thank-you');
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
              www.testsite.com
            </Text>
            <Text fontSize="sm" color="gray.500" mt={1}>
              Report generated on {new Date().toLocaleDateString()}
            </Text>
          </Box>
          <Box borderWidth={1} borderRadius="md" overflow="hidden">
            <Image
              src="/path-to-thumbnail-image.jpg"
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
              C+ (3.3)
            </Text>
          </Flex>
          <Text fontSize="xl">
            Overall, it could use some love and attention!
          </Text>
        </Box>

        <Accordion mt={10} width="100%">
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon as={MdPhotoCamera} mr={2} color="blue.500" />
                    <Text fontWeight="bold">Beauty</Text>
                  </Flex>
                </Box>
                <Text color="blue.500" fontWeight="bold" mr={2}>
                  B- (2.7)
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Your website's visual appeal is good, but there's room for
                improvement. Consider updating your color scheme, typography,
                and overall design to create a more modern and engaging look.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon as={MdDescription} mr={2} color="green.500" />
                    <Text fontWeight="bold">Content</Text>
                  </Flex>
                </Box>
                <Text color="green.500" fontWeight="bold" mr={2}>
                  B+ (3.3)
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Your content is well-written and informative. To improve
                further, consider adding more multimedia elements like images
                and videos, and ensure your content is regularly updated to keep
                it fresh and relevant.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon as={MdBrush} mr={2} color="purple.500" />
                    <Text fontWeight="bold">Design</Text>
                  </Flex>
                </Box>
                <Text color="purple.500" fontWeight="bold" mr={2}>
                  B (3.0)
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Your website's design is good, but there's potential for
                improvement. Focus on enhancing the layout for better user flow,
                ensure full responsiveness across all devices, and consider
                modernizing your design elements.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon as={MdSpeed} mr={2} color="red.500" />
                    <Text fontWeight="bold">Performance</Text>
                  </Flex>
                </Box>
                <Text color="red.500" fontWeight="bold" mr={2}>
                  C- (1.7)
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Your website's performance could be improved. Consider
                optimizing images, minifying CSS and JavaScript, and leveraging
                browser caching to enhance page load speed.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon as={MdSecurity} mr={2} color="teal.500" />
                    <Text fontWeight="bold">Security</Text>
                  </Flex>
                </Box>
                <Text color="teal.500" fontWeight="bold" mr={2}>
                  B+ (3.3)
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Your website has good security measures in place. Ensure you
                keep your SSL certificate up to date and consider implementing
                additional security headers for even better protection.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon as={MdSearch} mr={2} color="orange.500" />
                    <Text fontWeight="bold">SEO</Text>
                  </Flex>
                </Box>
                <Text color="orange.500" fontWeight="bold" mr={2}>
                  B- (2.7)
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Your SEO could use some work. Make sure all pages have unique
                titles and meta descriptions, optimize your content for relevant
                keywords, and improve your site's loading speed for better
                search engine rankings.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon as={MdCode} mr={2} color="pink.500" />
                    <Text fontWeight="bold">Web Standards</Text>
                  </Flex>
                </Box>
                <Text color="pink.500" fontWeight="bold" mr={2}>
                  A- (3.7)
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Your website adheres well to web standards. Keep up with the
                latest HTML, CSS, and JavaScript best practices to maintain this
                high standard.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon as={MdAccessibility} mr={2} color="cyan.500" />
                    <Text fontWeight="bold">Accessibility</Text>
                  </Flex>
                </Box>
                <Text color="cyan.500" fontWeight="bold" mr={2}>
                  B (3.0)
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Your website has good accessibility, but there's room for
                improvement. Ensure all images have alt text, improve color
                contrast where needed, and make sure all interactive elements
                are keyboard accessible.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Flex alignItems="center">
                    <Icon as={MdGrade} mr={2} color="yellow.500" />
                    <Text fontWeight="bold">Overall Grade</Text>
                  </Flex>
                </Box>
                <Text color="yellow.500" fontWeight="bold" mr={2}>
                  C+ (2.3)
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Your website's overall grade is C+. While there are some strong
                areas, there's significant room for improvement. Focus on
                enhancing your performance, SEO, and design to boost your
                overall grade. Regular updates and optimizations will help you
                achieve a better score and provide a superior user experience.
              </Text>
            </AccordionPanel>
          </AccordionItem>
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
              <Text>Direct Search Keywords</Text>
              <Text>Contextual Keywords</Text>
            </TabPanel>
            <TabPanel>
              <Box>
                <Flex direction="column" gap={4}>
                  <Box>
                    <Text fontWeight="bold">Robots.txt</Text>
                    <Text>Content for Robots.txt</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Indexable</Text>
                    <Text>Content for Indexable</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Redirects</Text>
                    <Text>Content for Redirects</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Meta</Text>
                    <Text>Content for Meta</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Search Engine Ranking</Text>
                    <Text>Content for Search Engine Ranking</Text>
                  </Box>
                </Flex>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <Flex direction="column" gap={4}>
                  <Box>
                    <Text fontWeight="bold">Cookies</Text>
                    <Text>Content for Robots.txt</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Javascript Files</Text>
                    <Text>Content for Indexable</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">CSS Files</Text>
                    <Text>Content for Redirects</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Page Size</Text>
                    <Text>Content for Meta</Text>
                  </Box>
                </Flex>
              </Box>
              <Text>Performance content goes here.</Text>
            </TabPanel>
            <TabPanel>
              <Box>
                <Flex direction="column" gap={4}>
                  <Box>
                    <Text fontWeight="bold">Grammatical Errors</Text>
                    <Text>Content for Grammatical Errors</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold"># of Words</Text>
                    <Text>Content for # of Words</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Unique Words</Text>
                    <Text>Content for Unique Words</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Images</Text>
                    <Text>Content for Images</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Videos</Text>
                    <Text>Content for Videos</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Backlinks</Text>
                    <Text>Content for Backlinks</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Language</Text>
                    <Text>Content for Language</Text>
                  </Box>
                </Flex>
              </Box>
            </TabPanel>
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
                      <Th>Conversion Rate</Th>
                      <Th>Link</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr backgroundColor="teal.600">
                      <Td>
                        <Image src={yourSiteData.thumbnail} width="300px" />
                      </Td>
                      <Td>Your Site</Td>
                      <Td>
                        {yourSiteData.avgMonthlyVisitors.toLocaleString()}
                      </Td>
                      <Td>{yourSiteData.bounceRate}%</Td>
                      <Td>{yourSiteData.conversionRate}%</Td>
                      <Td>
                        <IconButton
                          aria-label="Visit site"
                          onClick={() =>
                            window.open(yourSiteData.url, '_blank')
                          }
                        >
                          <Icon as={MdLink} />
                        </IconButton>
                      </Td>
                    </Tr>
                    {competitors.map((competitor, index) => (
                      <Tr key={index}>
                        <Td>
                          <Image src={competitor.thumbnail} width="300px" />
                        </Td>
                        <Td>{competitor.name}</Td>
                        <Td>
                          {competitor.avgMonthlyVisitors.toLocaleString()}
                        </Td>
                        <Td>{competitor.bounceRate}%</Td>
                        <Td>{competitor.conversionRate}%</Td>
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
            {recommendations.slice(0, 6).map((recommendation, index) => (
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
