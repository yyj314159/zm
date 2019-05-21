<template>
    <div id='websiteApp'>
        <resultWebsite></resultWebsite>
        <filterWebsite></filterWebsite>
    </div>
</template>
<script>
    import resultWebsite from './searchResultWebsite';
    import filterWebsite from './searchFilterWebsite';
    export default{
        name:'websiteApp',
        components:{
            resultWebsite,
            filterWebsite
        }
    }
</script>
<style>
    
</style>