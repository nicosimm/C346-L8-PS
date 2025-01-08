import React, { useState, useEffect } from 'react';
import { FlatList, Button, StyleSheet, Text, TouchableOpacity, View, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
        backgroundColor: '#fff',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    bookImage: {
        width: 50,
        height: 75,
        marginRight: 10,
    },
    bookDetails: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bookInfo: {
        fontSize: 14,
        color: '#555',
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});

const Home = ({ navigation }) => {
    const [bookList, setBookList] = useState([]);

    // Initialize AsyncStorage with datasource if empty
    const initializeBooks = async () => {
        const existingBooks = await AsyncStorage.getItem('books');
        if (!existingBooks) {
            const datasource = [
                {
                    title: 'Kings of the Wyld',
                    isbn: '9780356509020',
                    copies: 2,
                    image: 'https://m.media-amazon.com/images/I/81HsXl+Sp6L._AC_UF1000,1000_QL80_.jpg', // Use URL for remote images
                },
                {
                    title: 'The Lies of Locke Lamora',
                    isbn: '9780575086790',
                    copies: 1,
                    image: 'https://m.media-amazon.com/images/I/71S7S6scjcL._AC_UF1000,1000_QL80_.jpg',
                },
            ];
            await AsyncStorage.setItem('books', JSON.stringify(datasource));
        }
    };

    // Fetch data from AsyncStorage
    const loadBooks = async () => {
        try {
            const bookListStr = await AsyncStorage.getItem('books');
            if (bookListStr) {
                setBookList(JSON.parse(bookListStr));
            } else {
                setBookList([]);
            }
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };

    // Initialize books and load them on component mount
    useEffect(() => {
        initializeBooks();
        const unsubscribe = navigation.addListener('focus', loadBooks);
        return unsubscribe;
    }, [navigation]);

    // Render each book item
    const renderBookItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
                navigation.navigate('Edit', {
                    book: item,
                })
            }
        >
            {/* Display book image */}
            <Image
                source={{ uri: item.image }}  // This will handle remote image URLs
                style={styles.bookImage}
                resizeMode="cover"
            />
            <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookInfo}>ISBN: {item.isbn}</Text>
                <Text style={styles.bookInfo}>Copies: {item.copies}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Button
                title="Add New Book"
                onPress={() => navigation.navigate('Add')}
            />
            <FlatList
                data={bookList}
                renderItem={renderBookItem}
                keyExtractor={(item, index) => `${item.isbn}-${index}`}
                ListEmptyComponent={
                    <Text style={styles.emptyMessage}>No books added yet!</Text>
                }
            />
        </View>
    );
};

export default Home;
