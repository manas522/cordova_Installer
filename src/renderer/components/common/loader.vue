<template>
    <div class="loader" id="loader-6">
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>
<script>
</script>
<style lang="scss" scoped>
    #loader-6{
      top: 40px;
      left: -2.5px;
    }

    #loader-6 span{
      display: inline-block;
      width: 5px;
      height: 15px;
      background-color: #3498db;
    }

    #loader-6 span:nth-child(1){
      animation: grow 1s ease-in-out infinite;
    }

    #loader-6 span:nth-child(2){
      animation: grow 1s ease-in-out 0.15s infinite;
    }

    #loader-6 span:nth-child(3){
      animation: grow 1s ease-in-out 0.30s infinite;
    }
    @keyframes grow{
      0%, 100%{
        -webkit-transform: scaleY(1);
        -ms-transform: scaleY(1);
        -o-transform: scaleY(1);
        transform: scaleY(1);
      }

      50%{
        -webkit-transform: scaleY(1.8);
        -ms-transform: scaleY(1.8);
        -o-transform: scaleY(1.8);
        transform: scaleY(1.8);
      }
    }
</style>