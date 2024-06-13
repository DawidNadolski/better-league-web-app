<template>
  <table>
    <tr>
      <th>Miejsce</th>
      <th>Typer</th>
      <th>Punkty</th>
      <th>Dokładne wyniki</th>
      <th>Poprawne wyniki</th>
      <th>Błędne wyniki</th>
    </tr>
    <tr v-for="(user, index) in usersData" :key="user.name">
      <td>{{ index + 1 }}</td>
      <td>{{ user.userName }}</td>
      <td>{{ user.points }}</td>
      <td>{{ user.exactResults }}</td>
      <td>{{ user.correctResults }}</td>
      <td>{{ user.wrongResults }}</td>
    </tr>
  </table>
</template>

<script>
export default {
    props: ["usersData"]
};
</script>

<style scoped>
table, th, td {
  border: 0.5px solid black;
}
</style>