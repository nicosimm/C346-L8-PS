import React, { useState } from 'react';
import { View, Button, Text, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Add = ({ navigation, route }) => {
    const [title, setTitle] = useState('');
    const [isbn, setIsbn] = useState('');
    const [image, setImage] = useState('');
    const [copies, setCopies] = useState('');

    const handleSaveBook = async () => {
        // Retrieve current book list
        const bookListStr = await AsyncStorage.getItem('books');
        const bookList = bookListStr ? JSON.parse(bookListStr) : [];

        // Add new book
        const newBook = { title, isbn, image, copies: parseInt(copies, 10) || 0 };
        const updatedBookList = [...bookList, newBook];

        // Save to AsyncStorage
        await AsyncStorage.setItem('books', JSON.stringify(updatedBookList));

        // Navigate back to Home screen
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <Text>Title:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter book title"
            />

            <Text>ISBN:</Text>
            <TextInput
                style={styles.input}
                value={isbn}
                onChangeText={setIsbn}
                placeholder="Enter ISBN"
                keyboardType="numeric"
            />

            <Text>Image:</Text>
            <TextInput
                style={styles.input}
                value={image}
                onChangeText={setImage}
                placeholder="Enter image URL"
            />


            <Text>Copies Owned:</Text>
            <TextInput
                style={styles.input}
                value={copies}
                onChangeText={setCopies}
                placeholder="Enter number of copies"
                keyboardType="numeric"
            />

            <Button title="Add Book" onPress={handleSaveBook} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop:50,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 8,
    },
});

export default Add;
