import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Container,
  Heading,
  Spinner,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { network } from "../network/lib/supplier";
import { useState } from "react";
import Navbar from "./Navbar";

function MyTable() {
  const [data, setData] = useState([]);
  const [loggedIn, setLogged] = useState(false);
  const [update, setUpdate] = useState({});
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const loadData = () => {
    setLoading(true);
    network.getSupplier().then((data) => {
      setData(data);
      setLoading(false);
    });
  };

  useEffect(() => loadData(), []);

  const handleUpdate = (id) => {
    network.getOneSupplier(id).then((data) => setUpdate(data));
  };

  const handleDelete = (id) => {
    network.deleteSupplier(id).then(() => {
      loadData();
      toast({
        title: "Delete",
        description: `Supplier with id ${id} deleted`,
        status: "success",
        duration: 2000,
        position: "bottom-right",
        isClosable: true,
      });
    });
  };

  if (data.message) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>{data.name}</AlertTitle>
        <AlertDescription>{data.message}</AlertDescription>
      </Alert>
    );
  }

  const table = data.reverse().map((supplier) => (
    <Tr key={supplier.id}>
      <Td>{supplier.companyName}</Td>
      <Td>{supplier.contactName}</Td>
      <Td>{supplier.contactTitle}</Td>
      <Td>{supplier.address?.city}</Td>
      <Td>
        <Button
          colorScheme="red"
          variant="outline"
          size="md"
          isDisabled={!loggedIn}
          onClick={() => handleDelete(supplier.id)}
        >
          Delete
        </Button>
      </Td>
      <Td>
        <Button
          colorScheme="green"
          variant="outline"
          size="md"
          isDisabled={!loggedIn}
          onClick={() => handleUpdate(supplier.id)}
        >
          Update
        </Button>
      </Td>
    </Tr>
  ));

  return (
    <Container maxW="8xl">
      <Navbar
        loadData={loadData}
        update={update}
        setUpdate={setUpdate}
        loggedIn={loggedIn}
        setLogged={setLogged}
      />
      <Heading textAlign="center" mb="10" mt="5">
        CRUD Application
      </Heading>

      <Flex justify="center" align="center" flexDirection="column">
        {isLoading && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        )}

        {data.length > 0 && !isLoading && (
          <TableContainer>
            <Table variant="striped" size="lg" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Company Name</Th>
                  <Th>Contact Name</Th>
                  <Th>Contact Title</Th>
                  <Th>City</Th>
                </Tr>
              </Thead>
              <Tbody>{table}</Tbody>
            </Table>
          </TableContainer>
        )}
      </Flex>
    </Container>
  );
}

export default MyTable;
