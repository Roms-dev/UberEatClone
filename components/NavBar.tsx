import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NavBar = () => {
    return (
        <View style={styles.navBar}>
            <View>
                <Icon style={styles.iconContainer} name="arrow-back" size={30} color='white' onPress={() => { router.back() }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        padding: 5,
    },
navBar: {
    width: '100%',
    height: 100,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    position: 'absolute',
    padding: 25,
},
});

export default NavBar;