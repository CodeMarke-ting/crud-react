import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { network } from "../network/lib/supplier";
import { useEffect } from "react";

export default function Navbar({
  loadData,
  update,
  setUpdate,
  loggedIn,
  setLogged,
}) {
  const { isOpen, onToggle, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const schema = yup
    .object({
      companyName: yup.string().required(),
      contactName: yup.string().required(),
      contactTitle: yup.string().required(),
      address: yup.object({
        city: yup.string().required(),
      }),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const clear = () => {
    reset();
    onClose();
    loadData();
    setUpdate({});
  };

  const onSubmit = (data) => {
    if (Object.keys(update).length > 0) {
      network.updateSupplier(update.id, data).then(() => clear());
      toast({
        title: "Update",
        description: `Supplier updated`,
        status: "success",
        duration: 2000,
        position: "bottom-right",
        isClosable: true,
      });
    } else {
      network.addSupplier(data).then(() => {
        clear();
        toast({
          title: "Add",
          description: `Supplier added`,
          status: "success",
          duration: 2000,
          position: "bottom-right",
          isClosable: true,
        });
      });
    }
  };

  useEffect(() => {
    if (Object.keys(update).length > 0) {
      onOpen();
      setValue("companyName", update.companyName);
      setValue("contactName", update.contactName);
      setValue("contactTitle", update.contactTitle);
      setValue("address.city", update.address?.city);
    }
  }, [update]);

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {Object.keys(update).length > 0 ? "Update " : "Add "}
            Supplier
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Company Name</FormLabel>
              <Input type="text" {...register("companyName")} />
              <Text fontSize="xs" color="red.400">
                {errors.companyName?.message}
              </Text>
              <FormLabel>Contact Name</FormLabel>
              <Input type="text" {...register("contactName")} />
              <Text fontSize="xs" color="red.400">
                {errors.contactName?.message}
              </Text>
              <FormLabel>Contact Title</FormLabel>
              <Input type="text" {...register("contactTitle")} />
              <Text fontSize="xs" color="red.400">
                {errors.contactTitle?.message}
              </Text>
              <FormLabel>Address City</FormLabel>
              <Input type="text" {...register("address.city")} />
              <Text fontSize="xs" color="red.400">
                {errors.address?.city?.message}
              </Text>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleSubmit(onSubmit)}>
              {Object.keys(update).length > 0 ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            Logo
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Button onClick={onOpen} isDisabled={!loggedIn}>
            Add Supplier
          </Button>
          <Button
            as={"a"}
            fontSize={"sm"}
            fontWeight={400}
            variant={"link"}
            href={"#"}
            onClick={() => setLogged((prev) => !prev)}
          >
            {loggedIn ? "Log out" : " Log In"}
          </Button>
          {/* <Button
            as={"a"}
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"pink.400"}
            href={"#"}
            _hover={{
              bg: "pink.300",
            }}
          >
            Sign Up
          </Button> */}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Inspiration",
    children: [
      {
        label: "Explore Design Work",
        subLabel: "Trending Design to inspire you",
        href: "#",
      },
      {
        label: "New & Noteworthy",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
  {
    label: "Find Work",
    children: [
      {
        label: "Job Board",
        subLabel: "Find your dream design job",
        href: "#",
      },
      {
        label: "Freelance Projects",
        subLabel: "An exclusive list for contract work",
        href: "#",
      },
    ],
  },
  {
    label: "Learn Design",
    href: "#",
  },
  {
    label: "Hire Designers",
    href: "#",
  },
];
