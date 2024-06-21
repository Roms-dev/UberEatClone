import { View, StyleSheet, Image } from 'react-native';

const ImageContainer = (props) => {
    return (
        <View style={styles.platImage}>
                        <Image
                            style={styles.imagePlat}
                            source={{uri: props.imageUrl ?? 'https://png.pngtree.com/thumb_back/fw800/background/20231002/pngtree-3d-rendering-of-a-stunning-shopping-cart-banner-design-image_13554122.png'}}
                            contentFit="cover"
                        />
        </View>
    );
};

const styles = StyleSheet.create({
    platImage: {
        height: 200,
        position: 'relative',
    },
    imagePlat: {
        flex: 1,
        width: '100%',
    },
});


export default ImageContainer;