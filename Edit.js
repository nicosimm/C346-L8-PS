import React, { useState } from 'react';
import {
    Alert,
    View,
    Button,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
});

const Edit = ({ navigation, route }) => {
    const { book } = route.params; // Get the book data passed from Home
    const [title, setTitle] = useState(book.title);
    const [isbn, setIsbn] = useState(book.isbn);
    const [copies, setCopies] = useState(String(book.copies));

    const saveEdit = async () => {
        try {
            // Fetch the existing book list
            const bookListStr = await AsyncStorage.getItem('books');
            const bookList = bookListStr ? JSON.parse(bookListStr) : [];

            // Update the book entry
            const updatedBookList = bookList.map((b) =>
                b.isbn === book.isbn ? { ...b, title, isbn, copies: parseInt(copies) } : b
            );

            // Save the updated list back to AsyncStorage
            await AsyncStorage.setItem('books', JSON.stringify(updatedBookList));

            // Navigate back to the Home screen
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error saving the edited book:', error);
        }
    };

    const deleteBook = async () => {
        Alert.alert('Delete Book', 'Are you sure you want to delete this book?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        // Fetch the existing book list
                        const bookListStr = await AsyncStorage.getItem('books');
                        const bookList = bookListStr ? JSON.parse(bookListStr) : [];

                        // Remove the book from the list
                        const updatedBookList = bookList.filter((b) => b.isbn !== book.isbn);

                        // Save the updated list back to AsyncStorage
                        await AsyncStorage.setItem('books', JSON.stringify(updatedBookList));

                        // Navigate back to the Home screen
                        navigation.navigate('Home');
                    } catch (error) {
                        console.error('Error deleting the book:', error);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text>Title:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Text>ISBN:</Text>
            <TextInput
                style={styles.input}
                value={isbn}
                onChangeText={setIsbn}
            />
            <Text>Copies:</Text>
            <TextInput
                style={styles.input}
                value={copies}
                onChangeText={setCopies}
                keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Save"
                    onPress={saveEdit}
                    style={styles.button}
                />
                <Button
                    title="Delete"
                    onPress={deleteBook}
                    color="red"
                    style={styles.button}
                />
            </View>
        </View>
    );
};

export default Edit;
