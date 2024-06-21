import ImageContainer from "@/components/ImageContainer";
import NavBar from "@/components/NavBar";
import { View, SafeAreaView, ScrollView, Text, StyleSheet, Image } from "react-native";


const Pannier = () => {
    return (
        <SafeAreaView>
            <ScrollView /*contentContainerStyle={{ paddingBottom: 150 }}*/>
                <ImageContainer />
                {/* <View style={styles.platImage}>
                        <Image
                            style={styles.imagePlat}
                            source={{uri: 'https://png.pngtree.com/thumb_back/fw800/background/20231002/pngtree-3d-rendering-of-a-stunning-shopping-cart-banner-design-image_13554122.png'}}
                            contentFit="cover"
                        /> */}
                <NavBar />
        <Text>RESTAURANT</Text>
        <Text>PLAT</Text>
        <Text>PHOTO</Text>
        <Text>NOMBRE</Text>
        <Text>PRIX</Text>
    {/* </View> */}
    </ScrollView>
    </SafeAreaView>
)};

// const styles = StyleSheet.create({
//     platImage: {
//         height: 200,
//         position: 'relative',
//     },
//     imagePlat: {
//         flex: 1,
//         width: '100%',
//     },
// });

export default Pannier;